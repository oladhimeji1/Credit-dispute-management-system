-- Initialize database with sample data

-- Create admin user (password: admin123)
INSERT INTO users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(),
  'admin@creditveto.com',
  '$2b$10$8K1p/a0dPaNH4WRnWlJ6q.CeFP.JHtO7w2vHs8gFzGQYgJ5vGJUBi',
  'Admin',
  'User',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create sample user (password: user123)
INSERT INTO users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(),
  'john.doe@example.com',
  '$2b$10$8K1p/a0dPaNH4WRnWlJ6q.CeFP.JHtO7w2vHs8gFzGQYgJ5vGJUBi',
  'John',
  'Doe',
  'user',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create another sample user (password: user123)
INSERT INTO users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(),
  'jane.smith@example.com',
  '$2b$10$8K1p/a0dPaNH4WRnWlJ6q.CeFP.JHtO7w2vHs8gFzGQYgJ5vGJUBi',
  'Jane',
  'Smith',
  'user',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;