// middleware for authentication

export default async function authorize(request, _response, next) {
    const apiToken = request.headers['userToken'];
    
    request.user = await request.db.users.findByApiKey(apiToken);

    next();
  }