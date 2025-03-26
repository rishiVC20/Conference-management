const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://water11girl3:rishi123@cluster0.sxom3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h'
  },
  cors: {
    origin: function(origin, callback) {
      const allowedOrigins = [
        'https://confpict.netlify.app',
        'http://localhost:3000'
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('Not allowed by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  port: process.env.PORT || 5000
};

module.exports = config; 
