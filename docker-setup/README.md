
# Self-Hosted Supabase Setup for Event Management System

This guide will help you set up a completely offline Event Management System using self-hosted Supabase with Docker.

## Prerequisites

Before starting, ensure you have:
- Docker Desktop installed and running
- Git installed
- At least 4GB of available RAM
- 10GB+ of available disk space
- Basic command line knowledge

## Step 1: Clone Supabase

```bash
# Create a directory for your project
mkdir event-management-offline
cd event-management-offline

# Clone the official Supabase repository
git clone --depth 1 https://github.com/supabase/supabase.git
cd supabase/docker
```

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your preferred settings:

```bash
# Basic configuration
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_here_at_least_32_characters_long
ANON_KEY=your_anon_key_here
SERVICE_ROLE_KEY=your_service_role_key_here

# Network configuration for LAN access
SUPABASE_PUBLIC_URL=http://YOUR_SERVER_IP:8000
DASHBOARD_PORT=3000
API_PORT=8000
DB_PORT=5432

# Storage configuration
STORAGE_BACKEND=file
```

## Step 3: Generate JWT Keys

Generate secure JWT keys for your installation:

```bash
# Install jwt-cli if you don't have it
npm install -g jwt-cli

# Generate anon key (public access)
jwt sign --alg HS256 --iss supabase --role anon --exp 1983812996 --secret "your_jwt_secret_here"

# Generate service role key (admin access)
jwt sign --alg HS256 --iss supabase --role service_role --exp 1983812996 --secret "your_jwt_secret_here"
```

Update your `.env` file with these generated keys.

## Step 4: Start Supabase Services

```bash
# Start all Supabase services
docker compose up -d

# Check that all services are running
docker compose ps
```

You should see these services running:
- supabase-db (PostgreSQL database)
- supabase-auth (Authentication service)
- supabase-rest (API service)
- supabase-realtime (Real-time subscriptions)
- supabase-storage (File storage)
- supabase-imgproxy (Image processing)
- supabase-meta (Metadata service)
- supabase-studio (Admin dashboard)

## Step 5: Set Up Database Schema

1. Open the Supabase Studio dashboard at `http://localhost:3000`
2. Go to the SQL Editor
3. Copy and paste the contents of `schema.sql` (provided with your application)
4. Run the SQL script to create all tables and policies

Alternatively, you can run it via command line:

```bash
# Copy the schema file to the container
docker cp ../path/to/schema.sql supabase-db:/tmp/schema.sql

# Execute the schema
docker exec -it supabase-db psql -U postgres -d postgres -f /tmp/schema.sql
```

## Step 6: Configure Your Application

Create a `.env.local` file in your application root:

```bash
# Supabase configuration
VITE_SUPABASE_URL=http://YOUR_SERVER_IP:8000
VITE_SUPABASE_ANON_KEY=your_anon_key_from_step_3

# Database connection (if needed for direct access)
VITE_DB_HOST=YOUR_SERVER_IP
VITE_DB_PORT=5432
VITE_DB_NAME=postgres
```

## Step 7: Build and Deploy Your Application

```bash
# In your application directory
npm install
npm run build

# Serve the built application
npm run preview
```

Or deploy to your web server of choice.

## Step 8: Access Your Application

1. **Application**: `http://YOUR_SERVER_IP:4173` (or your chosen port)
2. **Supabase Studio**: `http://YOUR_SERVER_IP:3000`
3. **API**: `http://YOUR_SERVER_IP:8000`
4. **Database**: `YOUR_SERVER_IP:5432`

## Default Login Credentials

The system creates a default admin account:
- **Email**: admin@localhost
- **Password**: admin123

**⚠️ IMPORTANT**: Change these credentials immediately after first login!

## LAN Network Configuration

To make the system accessible from other devices on your LAN:

1. **Find your server's IP address**:
   ```bash
   # On Linux/Mac
   ip addr show
   
   # On Windows
   ipconfig
   ```

2. **Update configuration files** with your actual IP address instead of `localhost`

3. **Configure firewall** to allow access to ports:
   - 3000 (Supabase Studio)
   - 8000 (API)
   - 5432 (Database)
   - 4173 (Application)

4. **Test connectivity** from another device:
   ```bash
   # Test API connectivity
   curl http://YOUR_SERVER_IP:8000/rest/v1/
   ```

## Backup and Maintenance

### Database Backup
```bash
# Create backup
docker exec supabase-db pg_dump -U postgres postgres > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker exec -i supabase-db psql -U postgres postgres < backup_file.sql
```

### Update Supabase
```bash
# Stop services
docker compose down

# Pull latest images
docker compose pull

# Restart services
docker compose up -d
```

## Troubleshooting

### Common Issues

1. **Services won't start**:
   - Check Docker is running
   - Verify port availability
   - Check logs: `docker compose logs`

2. **Can't connect from other devices**:
   - Verify firewall settings
   - Check IP address configuration
   - Ensure services are bound to 0.0.0.0, not 127.0.0.1

3. **Database connection errors**:
   - Verify credentials in `.env`
   - Check database is running: `docker compose ps`
   - Review logs: `docker compose logs supabase-db`

4. **Authentication not working**:
   - Verify JWT secrets match
   - Check API endpoint configuration
   - Review auth logs: `docker compose logs supabase-auth`

### Log Monitoring
```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f supabase-db
docker compose logs -f supabase-auth
```

## Security Considerations

1. **Change default passwords** immediately
2. **Use strong JWT secrets** (at least 32 characters)
3. **Configure firewall** properly for your network
4. **Regular backups** of your database
5. **Monitor logs** for suspicious activity
6. **Update regularly** to get security patches

## Production Deployment

For production use:

1. Use a proper reverse proxy (nginx, traefik)
2. Enable SSL/TLS certificates
3. Set up automated backups
4. Configure monitoring and alerting
5. Implement proper log rotation
6. Use Docker secrets for sensitive data

## Support

For issues with:
- **Supabase setup**: Check the [official Supabase documentation](https://supabase.com/docs)
- **Application issues**: Review the application logs and console errors
- **Docker issues**: Check Docker Desktop status and logs

Remember to document any custom changes you make to this setup for future reference!
