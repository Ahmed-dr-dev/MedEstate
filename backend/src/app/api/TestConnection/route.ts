

export async function GET(request: Request) {
  const response = {
    status: "success",
    message: "Connection established successfully",
    timestamp: new Date().toISOString(),
    server: "MedEstate Backend API",
    version: "1.0.0"
  };

  return Response.json(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}