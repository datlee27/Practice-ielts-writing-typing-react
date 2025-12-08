#!/bin/bash

echo "🚀 Setting up IELTS Writing Practice Monorepo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing client dependencies..."
npm run install:client

echo "📦 Installing server dependencies..."
npm run install:server

echo "📝 Setting up server environment file..."
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env file."
    echo ""
    echo "📋 Default configuration (using SQLite for development):"
    echo "   - Database: SQLite (database.sqlite in server folder)"
    echo "   - JWT_SECRET: Auto-generated (change for production)"
    echo ""
    echo "💡 For production with MySQL, update server/.env with:"
    echo "   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
    echo "   - Set USE_SQLITE=false"
    echo ""
    echo "🔄 To use MySQL instead of SQLite, run:"
    echo "   mysql -u root -p -e 'CREATE DATABASE ielts_writing_practice;'"
    echo "   Then set USE_SQLITE=false in server/.env"
fi

echo "🗄️  Running database migrations..."
npm run db:migrate

echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start both client and server:"
echo "   npm run dev"
echo ""
echo "🌐 Client will be available at: http://localhost:5173"
echo "🔧 Server API will be available at: http://localhost:5000"
echo "🏥 Health check: http://localhost:5000/health"