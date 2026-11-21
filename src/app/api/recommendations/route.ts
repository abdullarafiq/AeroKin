import { NextRequest, NextResponse } from 'next/server';
import { recommendationRequestSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rateLimiter';
import { generateAeroKinRecommendations } from '@/lib/geminiService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Max 15 requests per minute per client IP)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous-user';

    const rateLimit = checkRateLimit(clientIp, 15, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait before generating another customized routine.',
          resetSeconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // 2. Body Parsing & Zod Validation
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Missing or malformed JSON body' }, { status: 400 });
    }

    const validation = recommendationRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed on household profile or AQI payload',
          issues: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { profile, currentAqi, pm25, inversionRisk, city } = validation.data;

    // 3. Generate GenAI Recommendations
    const recommendations = await generateAeroKinRecommendations({
      profile,
      currentAqi,
      pm25,
      inversionRisk,
      city,
    });

    return NextResponse.json(recommendations, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate recommendations',
        message: error instanceof Error ? error.message : 'Unknown internal error',
      },
      { status: 500 }
    );
  }
}
