// app/api/reviews/route.ts
import { NextResponse } from 'next/server';

// Типы для нового ответа от Google API
interface NewReview {
  authorAttribution: {
    displayName: string;
    photoUri: string;
  };
  publishTime: string;
  rating: number;
  text: {
    text: string;
    languageCode: string;
  };
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'API key or Place ID is not configured' }, { status: 500 });
  }

  // Добавляем параметр `languageCode=uk` в URL, чтобы явно запросить украинский язык
  const url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=uk`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        // Запрашиваем только нужные поля
        'X-Goog-FieldMask': 'reviews,rating',
      },
      next: {
        revalidate: 86400, // Кэшируем на 1 день
      },
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Google API Error: ${data.error.message}`);
    }

    // Преобразуем новый формат ответа в старый
    const reviews = (data.reviews || []).map((review: NewReview) => ({
      author_name: review.authorAttribution.displayName,
      profile_photo_url: review.authorAttribution.photoUri,
      rating: review.rating,
      text: review.text.text,
      relative_time_description: new Date(review.publishTime).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: new Date(review.publishTime).getTime() / 1000,
    }));

    // Сортируем отзывы, чтобы самые новые были первыми
    const sortedReviews = reviews.sort((a, b) => b.time - a.time);

    return NextResponse.json(sortedReviews);
  } catch (error: any) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews from Google' },
      { status: 500 }
    );
  }
}
