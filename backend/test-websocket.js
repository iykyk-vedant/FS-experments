/**
 * Automated Verification Script for Experiment 8: Real-Time WebSockets Communication (Socket.IO)
 */
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:5000";

async function runWebSocketTests() {
  console.log("⚡ STARTING EXPERIMENT 8 WEBSOCKET VERIFICATION\n");

  let student1, student2;

  try {
    // 1. Connect Student 1
    console.log("1. Connecting Client 1 (Student 1)...");
    student1 = await new Promise((resolve, reject) => {
      const s = io(SERVER_URL, { timeout: 5000 });
      s.on("connect", () => resolve(s));
      s.on("connect_error", (err) => reject(new Error("Student 1 connection failed: " + err.message)));
    });
    console.log(`   Connected Student 1 with Socket ID: ${student1.id}`);

    // 2. Connect Student 2
    console.log("2. Connecting Client 2 (Student 2)...");
    student2 = await new Promise((resolve, reject) => {
      const s = io(SERVER_URL, { timeout: 5000 });
      s.on("connect", () => resolve(s));
      s.on("connect_error", (err) => reject(new Error("Student 2 connection failed: " + err.message)));
    });
    console.log(`   Connected Student 2 with Socket ID: ${student2.id}`);

    // 3. Student 1 sends a message to Student 2
    console.log("\n3. Testing Real-Time Broadcast: Student 1 -> Student 2...");
    const msgFromStudent1Promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout waiting for message from Student 1")), 5000);
      student2.on("chatMessage", (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    student1.emit("chatMessage", {
      username: "Student 1",
      message: "Hello Student 2!"
    });

    const receivedByStudent2 = await msgFromStudent1Promise;
    console.log(`   Student 2 received: [${receivedByStudent2.username}]: "${receivedByStudent2.message}"`);
    if (receivedByStudent2.username !== "Student 1" || receivedByStudent2.message !== "Hello Student 2!") {
      throw new Error("Message content mismatch for Student 1 message!");
    }
    console.log("   ✅ Message delivered instantly across WebSockets without browser reload!");

    // 4. Student 2 replies to Student 1
    console.log("\n4. Testing Real-Time Reply: Student 2 -> Student 1...");
    const msgFromStudent2Promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("Timeout waiting for reply from Student 2")), 5000);
      student1.on("chatMessage", (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    student2.emit("chatMessage", {
      username: "Student 2",
      message: "Hello Student 1!"
    });

    const receivedByStudent1 = await msgFromStudent2Promise;
    console.log(`   Student 1 received: [${receivedByStudent1.username}]: "${receivedByStudent1.message}"`);
    if (receivedByStudent1.username !== "Student 2" || receivedByStudent1.message !== "Hello Student 1!") {
      throw new Error("Message content mismatch for Student 2 message!");
    }
    console.log("   ✅ Bidirectional broadcast verified!");

    console.log("\n🎉 ALL EXPERIMENT 8 WEBSOCKET TESTS PASSED SUCCESSFULLY!\n");
  } catch (error) {
    console.error("\n❌ WebSocket Verification Failed:", error.message);
    process.exit(1);
  } finally {
    if (student1) student1.disconnect();
    if (student2) student2.disconnect();
  }
}

runWebSocketTests();
