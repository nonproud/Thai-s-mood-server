# Thai-s-mood-server
Thais Mood server พัฒนาบน NodeJS + ExpressJS 
โดยจะแบ่งเป็น 4 ไฟล์ (services) ด้วยกันคือ 
1. member-server.js (/member/*)
  ในไฟล์นี้จะเป็น APIs ที่เกี่ยวข้องกับการจัดการข้อมูลสมาชิกทั้งหมด รันอยู่บน port 4553
2. record-server.js (/record/*)
  ในไฟล์นี้จะเป็น APIs ที่เกี่ยวข้องกับการจัดการข้อมูลอารมณ์ การนอน ไดอารี รันอยู่บน port 5553
3. evaluation-server.js (/evaluation/*)
  ในไฟล์นี้จะเป็น APIs ที่เกี่ยวข้องกับการจัดการข้อมูลการทำแบบประเมิน รันอยู่บน port 6553
4. researcher-server.js (/more/*)
  ในไฟล์นี้จะเป็น APIs ที่เกี่ยวข้องกับฟังค์ชันอื่นๆ รันอยู่บน port7553
  
## สิ่งที่ต้องเตรียมก่อน deploy server
1. ติดตั้ง [NodeJS](https://nodejs.org/en/download/) 
2. ติดตั้ง [ExpressJS](https://expressjs.com/en/starter/installing.html)

## การรัน deploy server
1. ให้ออกคำสั่ง npm install ภายใต้ Directory Thais Mood server
```bash
npm install
```
2. รัน service ขึ้นมา
```bash
    node main-server.js
```

