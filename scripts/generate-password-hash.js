const bcrypt = require("bcryptjs")

async function generatePasswordHash() {
  const password = "admin123"
  const saltRounds = 10

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log("Password:", password)
    console.log("Hash:", hash)

    // 検証
    const isValid = await bcrypt.compare(password, hash)
    console.log("Verification:", isValid)

    return hash
  } catch (error) {
    console.error("Error generating hash:", error)
  }
}

generatePasswordHash()
