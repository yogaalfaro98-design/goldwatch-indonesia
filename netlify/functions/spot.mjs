
export default async () => {
  try {
    const apiKey = Netlify.env.get("GOLDPRICE_API_KEY");

    if (!apiKey) {
      return Response.json(
        { error: "API key belum tersedia di Netlify" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.goldprice.dev/v1/spot/XAU-USD-SPOT",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json"
        },
        signal: AbortSignal.timeout(10000)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: "Gagal mengambil harga emas", status: response.status },
        { status: 502 }
      );
    }

    return Response.json(
      {
        symbol: data.symbol,
        price: data.price,
        currency: data.quote_currency,
        is_stale: data.is_stale,
        computed_at: data.computed_at
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60"
        }
      }
    );

  } catch (error) {
    return Response.json(
      { error: "Koneksi harga emas sedang bermasalah" },
      { status: 500 }
    );
  }
};
