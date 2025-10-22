import pywhatkit as kit
import time

# Recipient's phone number in international format
phone_number = "+918318217092"

# Message to send
message = "Hello! This is an automated repeated message from Python."

# Number of repetitions
repeat_count = 5

# Interval in seconds between messages
interval = 1 # 60 seconds

for i in range(repeat_count):
    print(f"📨 Sending message {i+1}/{repeat_count}...")
    # Send instantly (browser must be logged into WhatsApp Web)
    kit.sendwhatmsg_instantly(phone_number, message, wait_time=10, tab_close=True)
    if i != repeat_count - 1:
        time.sleep(interval)

print("✅ All messages sent successfully!")
