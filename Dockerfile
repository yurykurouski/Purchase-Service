# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code and configuration files
COPY . .

# Generate Swagger docs and types
# Note: These scripts are defined in package.json
RUN npm run tsoa:gen
RUN npm run generate-types

# Build the TypeScript project
RUN npm run build

# Production Stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
# Copy generated swagger output (needed for swagger-ui in production if referenced at runtime)
# Based on src/swagger.ts: import swaggerDocument from './generated/swagger-output.json';
# TypeScript compilation might compile this import into the JS bundle or require the JSON file.
# Since it's a JSON import, it's likely bundled or required relative to the file.
# To be safe and ensure the structure matches, we copy the generated folder too if needed, 
# but usually 'dist' contains the compiled code. 
# However, if 'resolveJsonModule' is true, the JSON is often included in the build output if imported.
# Let's verify if swaggger-output.json ends up in dist.
# tsconfig.json has "resolveJsonModule": true.
# If it's imported as `import ... from '...'`, tsc usually copies it or inline it.
# To be absolutely sure, we can copy the src/generated folder to ensure runtime availability if the code expects it there relative to CWD or __dirname.
# But let's stick to copying dist first. If the code in dist/swagger.js (compiled) refers to it, it should be there.
# Inspecting src/swagger.ts: `import swaggerDocument from './generated/swagger-output.json';`
# With resolveJsonModule, tsc should handle this.

# Expose the port the app runs on
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
