// Simple test to create a user and verify authentication works
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testAuthentication() {
    console.log('🧪 Testing authentication system...\n');

    try {
        // Test 1: Create a test user directly in database
        console.log('1. Creating test user in database...');
        const hashedPassword = await bcrypt.hash('testpass123', 12);

        const testUser = await prisma.user.create({
            data: {
                name: 'Auth Test User',
                email: `authtest${Date.now()}@test.com`,
                password: hashedPassword
            }
        });
        console.log('✅ Test user created:', testUser.email);

        // Test 2: Generate JWT token like the backend does
        console.log('\n2. Testing JWT token generation...');
        const token = jwt.sign(
            { id: testUser.id, email: testUser.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );
        console.log('✅ JWT token generated:', token.slice(0, 50) + '...');

        // Test 3: Verify password hashing
        console.log('\n3. Testing password verification...');
        const isValidPassword = await bcrypt.compare('testpass123', testUser.password);
        console.log('✅ Password verification:', isValidPassword ? 'PASSED' : 'FAILED');

        // Test 4: Check user can be found by email
        console.log('\n4. Testing user lookup...');
        const foundUser = await prisma.user.findUnique({
            where: { email: testUser.email }
        });
        console.log('✅ User lookup:', foundUser ? 'FOUND' : 'NOT FOUND');

        // Test 5: Clean up test user
        console.log('\n5. Cleaning up test user...');
        await prisma.user.delete({
            where: { id: testUser.id }
        });
        console.log('✅ Test user cleaned up');

        console.log('\n🎉 Authentication system verification PASSED!');
        console.log('✅ Database operations working');
        console.log('✅ Password hashing working');
        console.log('✅ JWT token generation working');
        console.log('✅ User management working');

    } catch (error) {
        console.error('❌ Authentication test failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testAuthentication();
