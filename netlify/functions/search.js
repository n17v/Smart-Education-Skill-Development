exports.handler = async (event) => {
  const query = event.queryStringParameters?.query || "";
  try {
    const response = await fetch(`[https://api.search.tinyfish.ai?query=$](https://api.search.tinyfish.ai?query=$){encodeURIComponent(query)}&location=US`, {
      headers: { "X-API-Key": process.env.TINYFISH_API_KEY }
    });

    const data = await response.json();
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
