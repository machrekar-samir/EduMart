import mongoose from 'mongoose'

let memoryServer = null

export async function connectDB() {
  const preferredUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edumart'

  if (process.env.USE_MEMORY_DB === 'true') {
    await connectMemory()
    return
  }

  try {
    await mongoose.connect(preferredUri, { serverSelectionTimeoutMS: 4000 })
    console.log('MongoDB connected')
    return
  } catch (err) {
    console.warn(`MongoDB at ${preferredUri} unavailable: ${err.message}`)
  }

  if (process.env.USE_MEMORY_DB === 'false') {
    throw new Error(
      'Could not connect to MongoDB. Install MongoDB or set USE_MEMORY_DB=true'
    )
  }

  await connectMemory()
}

async function connectMemory() {
  const { MongoMemoryServer } = await import('mongodb-memory-server')
  memoryServer = await MongoMemoryServer.create()
  await mongoose.connect(memoryServer.getUri())
  console.log('MongoDB connected (in-memory — data resets when server stops)')
}

export async function disconnectDB() {
  await mongoose.disconnect()
  if (memoryServer) {
    await memoryServer.stop()
    memoryServer = null
  }
}
