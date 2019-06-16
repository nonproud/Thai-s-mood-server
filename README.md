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
1. ถ้าหากมีโฟลเดอร์ node_modules อยู่ให้ทำการลบออกก่อน
2. ให้ออกคำสั่ง npm install ภายตั้ง Directory Thais Mood server
```bash
npm install
```
3. ในการรันแต่ละ service ให้ manual run แต่ละไฟล์ดังนี้

3.1 /member
```bash
    node member-server.js
```
3.2 /record
```bash
    node record-server.js
```
3.3 /evaluation
```bash
    node evaluation-server.js
```
3.4 /researcher
```bash
    node researcher-server.js
```
    
##เพิ่มเติม
เนื่องจากตอนพัฒนาผู้พัฒนาใช้ nginx เป็นตัวรับ Request แล้วกระจายไปยัง services ต่างๆ ทั้งนี้ตัว service สามารถใช้งานได้เลยหากเรียกผ่าน port 
