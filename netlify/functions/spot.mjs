
export default async () => {
  try {
    const response = await fetch(
      "https://api.goldprice.dev/v1/prices?symbol=XAU-USD-SPOT",
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Gagal mengambil harga emas", status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();
    const gold = data.symbols?.[0];

    if (!gold) {
      return Response.json(
        { error: "Data harga emas tidak ditemukan" },
        { status: 502 }
      );
    }

    return Response.json(
      {
        symbol: gold.symbol,
        price: gold.price,
        currency: gold.quote_currency,
        unit: gold.unit,
        is_stale: gold.is_stale,
        computed_at: gold.computed_at
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300"
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
