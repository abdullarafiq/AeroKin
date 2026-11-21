import { NextRequest, NextResponse } from 'next/server';
import { aqiQuerySchema } from '@/lib/schemas';
import { getAQIDataForLocation } from '@/lib/aqiData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = {
      city: searchParams.get('city') || undefined,
      lat: searchParams.get('lat') || undefined,
      lon: searchParams.get('lon') || undefined,
    };

    const parsedQuery = aqiQuerySchema.safeParse(rawQuery);

    if (!parsedQuery.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: parsedQuery.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { city, lat, lon } = parsedQuery.data;
    const aqiData = getAQIDataForLocation(city || 'New Delhi', lat, lon);

    // Stale-while-revalidate HTTP caching: cache for 5 minutes, serve stale up to 10 minutes
    const response = NextResponse.json(aqiData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-AeroKin-Source': 'AeroKin-Atmospheric-Engine',
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve AQI data',
        message: error instanceof Error ? error.message : 'Unknown internal error',
      },
      { status: 500 }
    );
  }
}
