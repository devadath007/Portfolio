import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCaD6y_7yeFjQnkGngSyTlUsTNg4B7WwrE",
  authDomain: "portfolio-cccd5.firebaseapp.com",
  projectId: "portfolio-cccd5",
  storageBucket: "portfolio-cccd5.firebasestorage.app",
  messagingSenderId: "1049247291249",
  appId: "1:1049247291249:web:e36d06b1f689f499dd88d0",
  measurementId: "G-G83RGTKWWV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultPortfolioData = {
    hero: {
        name: "Devadath A S",
        tagline: "Computer Science & Engineering | Computer Vision & Machine Learning",
        description: "Engineering efficient algorithms and translating complex computer vision models into real-world applications.",
        imageUrl: ""
    },
    about: {
        bio: "I am currently pursuing my B.Tech in Computer Science and Engineering at APJ Abdul Kalam Technological University (KTU). My primary focus lies in building practical AI solutions, with a strong passion for real-time object detection and algorithmic efficiency."
    },
    projects: [
        {
            id: 1,
            title: "Smart AI Based Attendance Monitoring System Using YOLO26",
            description: "An advanced, automated attendance tracking system leveraging YOLO object detection to accurately recognize and log individuals in real-time.",
            imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Electricity Theft and Overuse Detection using Generative AI",
            description: "Currently in development. Exploring how Generative AI can be leveraged to detect anomalies in power consumption.",
            imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "NexDrop",
            description: "Secure cross-platform file sharing protocol and application.",
            imageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ],
    certifications: [
        {
            id: 1,
            title: "VIRTUAL LAB in association with NIT, Surathkal",
            description: "Attended a one day online workshop on the topic 'VIRTUAL LAB' organized by Department of Computer Science & Engineering on 10th January 2025.",
            imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Vidya Hackathon",
            description: "Participated in Vidya Hackathon, a 2-day offline hackathon, held on February 19-20, 2025 conducted by Department of Computer Science and Engineering, Thiruvananthapuram, Kerala.",
            imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ],
    skills: [
        { id: 1, name: "Python", label: "AI & Backend", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
        { id: 2, name: "JavaScript", label: "Frontend", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
        { id: 3, name: "HTML5", label: "Structure", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
        { id: 4, name: "CSS3", label: "Styling", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
        { id: 5, name: "OpenCV", label: "Computer Vision", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg" },
        { id: 6, name: "TensorFlow", label: "Machine Learning", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg" },
        { id: 7, name: "npm", label: "Package Manager", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" },
        { id: 8, name: "SQL", label: "Database", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
        { id: 9, name: "C", label: "System", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
        { id: 10, name: "Git", label: "Version Control", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
        { id: 11, name: "GitHub", label: "Repository", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" },
        { id: 12, name: "ChatGPT", label: "AI Assistant", imageUrl: "https://cdn.simpleicons.org/chatgpt/10A37F" },
        { id: 13, name: "Claude", label: "Anthropic AI", imageUrl: "https://cdn.simpleicons.org/anthropic/D97757" },
        { id: 14, name: "Gemini", label: "Google AI", imageUrl: "https://cdn.simpleicons.org/googlegemini/8E75B2" },
        { id: 15, name: "Kali Linux", label: "Security OS", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kalilinux/kalilinux-original.svg" },
        { id: 16, name: "Node.js", label: "Runtime", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" }
    ],
    contact: {
        email: "devadath754@gmail.com",
        github: "https://github.com/ridern386",
        linkedin: "https://www.linkedin.com/in/devadath-a-s/"
    }
};

export class PortfolioDataManager {
    constructor() {
        this.storageKey = 'portfolio_data_v2'; 
        this.data = null;
    }

    async init() {
        try {
            const docRef = doc(db, "portfolio", "data");
            
            // EMERGENCY RESTORE: If opened locally, forcefully push local storage to Firebase
            if (window.location.protocol === 'file:') {
                const localDataStr = localStorage.getItem(this.storageKey);
                if (localDataStr) {
                    this.data = JSON.parse(localDataStr);
                    await setDoc(docRef, this.data);
                    console.log("SUCCESSFULLY RESTORED LOCAL DATA TO FIREBASE!");
                }
            }

            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && window.location.protocol !== 'file:') {
                this.data = docSnap.data();
            } else if (!this.data) {
                // Initial migration from local storage or default
                const localData = localStorage.getItem(this.storageKey);
                this.data = localData ? JSON.parse(localData) : JSON.parse(JSON.stringify(defaultPortfolioData));
                await setDoc(docRef, this.data);
            }

            // Apply patch for new skills and logos
            if (this.patchData()) {
                console.log("Applied skills patch. Saving to Firebase...");
                try {
                    await setDoc(doc(db, "portfolio", "data"), this.data);
                    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
                } catch(e) {}
            }

        } catch (e) {
            console.error("Error connecting to Firebase:", e);
            // Fallback to local storage
            const localData = localStorage.getItem(this.storageKey);
            this.data = localData ? JSON.parse(localData) : JSON.parse(JSON.stringify(defaultPortfolioData));
        }
    }

    async saveData(newData) {
        this.data = newData;
        
        // Backup to local storage
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) { console.error("Local storage error:", e); }

        try {
            const docRef = doc(db, "portfolio", "data");
            await setDoc(docRef, newData);
        } catch (e) {
            console.error("Error saving to Firebase:", e);
            alert("Failed to save to Firebase! If you added an image, it might be too large.");
        }
    }

    getData() {
        return this.data;
    }

    patchData() {
        if (!this.data || !this.data.skills) return false;
        let modified = false;

        const requiredSkills = [
            { name: "Postman", label: "Tools", imageUrl: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
            { name: "C", label: "Language", imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBmaWxsPSIjMDM1OTlDIiBkPSJNMTE3LjUgMzMuNWwtNTMuNS0zMWMtMi0xLjItNC41LTEuMi02LjUgMGwtNTMuNSAzMWMtMiAxLjItMy4zIDMuMy0zLjMgNS43djYxLjhjMCAyLjQgMS4zIDQuNSAzLjMgNS43bDUzLjUgMzFjMiAxLjIgNC41IDEuMiA2LjUgMGw1My41LTMxYzItMS4yIDMuMy0zLjMgMy4zLTUuN1YzOS4yYzAtMi40LTEuMy00LjUtMy4zLTUuN3ptLTI3LjEgNTNjLTQuNCA3LjUtMTIuNyAxMi41LTIyLjEgMTIuNS0xNC4xIDAtMjUuNS0xMS40LTI1LjUtMjUuNXMxMS40LTI1LjUgMjUuNS0yNS41YzguNyAwIDE2LjQgNC40IDIxLjExMWwtOSA2LjJjLTMuMS00LjItNy41LTYuOC0xMi4xLTYuOC04LjMgMC0xNSA2LjctMTUgMTVzNi43IDE1IDE1IDE1YzUgMCA5LjgtMyAxMi41LTcuN2w5LjYgNS44eiIvPjwvc3ZnPg==" },
            { name: "C++", label: "Language", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
            { name: "Arduino", label: "Hardware", imageUrl: "https://cdn.worldvectorlogo.com/logos/arduino-1.svg" },
            { name: "FaceNet", label: "Computer Vision", imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4gPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGMDBGRiIgc3Ryb2tlLXdpZHRoPSI2Ii8+IDxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjRkYwMEZGIi8+IDxwYXRoIGQ9Ik0yNSA4MCBRNTAgNTAgNzUgODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGMDBGRiIgc3Ryb2tlLXdpZHRoPSI2Ii8+IDxsaW5lIHgxPSIxMCIgeTE9IjUwIiB4Mj0iOTAiIHkyPSI1MCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==" },
            { name: "YOLO", label: "Object Detection", imageUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4gPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwRkZGRiIgc3Ryb2tlLXdpZHRoPSI4IiBzdHJva2UtZGFzaGFycmF5PSIyMCwxMCIgcng9IjEwIi8+IDx0ZXh0IHg9IjUwJSIgeT0iNTUlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMDBGRkZGIj5ZT0xPPC90ZXh0Pjwvc3ZnPg==" }
        ];

        requiredSkills.forEach(req => {
            const exists = this.data.skills.find(s => s.name.toLowerCase() === req.name.toLowerCase());
            if (!exists) {
                this.data.skills.push({
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    name: req.name,
                    label: req.label,
                    imageUrl: req.imageUrl
                });
                modified = true;
            }
        });

        return modified;
    }
}

export const portfolioManager = new PortfolioDataManager();
window.portfolioManager = portfolioManager; // Expose globally for inline scripts
