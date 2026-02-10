# 1. Imagen base con dependencias de Playwright
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# 2. Instalamos Bun
RUN apt-get update && apt-get install -y curl unzip \
    && curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

# 3. Instalamos dependencias (usando el lockfile de Bun)
COPY package.json bun.lockb* ./
RUN bun install

# 4. Copiamos el código
COPY . .

# 5. Puerto que usa Fly
EXPOSE 3000

# 6. Arrancamos directo con el script de Bun
# No hace falta "build" a JS, Bun se encarga
CMD ["bun", "run", "start"]