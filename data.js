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

        const correctLogos = {
            "ChatGPT": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzEwYTM3ZiI+PHBhdGggZD0iTTIyLjI4IDEwLjQ2Yy0uMDUtMS41Ny0uNzMtMy4wNy0xLjktNC4xNC0xLjE3LTEuMDctMi43My0xLjU1LTQuMjgtMS4zLTEuMDctMS4wNy0yLjYxLTEuNjEtNC4xNS0xLjQ2LTEuNTQuMTUtMi45NS45Ni0zLjgzIDIuMTlDNi41NCA1LjMzIDQuOSA1LjQ4IDMuNTUgNi4yNyAyLjIgNy4wNSAxLjI1IDguMzUuOTYgOS44N2MtLjI5IDEuNTItLjAyIDMuMDkuNzMgNC40MS4wNSAxLjU3LjczIDMuMDcgMS45IDQuMTQgMS4xNyAxLjA3IDIuNzMgMS41NSA0LjI4IDEuMyAxLjA3IDEuMDcgMi42MSAxLjYxIDQuMTUgMS40NiAxLjU0LS4xNSAyLjk1LS45NiAzLjgzLTIuMTkgMS41OS40MiAzLjIyLjI3IDQuNTgtLjUxIDEuMzUtLjc4IDIuMy0yLjA4IDIuNTktMy42LjI5LTEuNTIuMDItMy4wOS0uNzMtNC40MWwtLjAxLS4wMXptLTMuMyAyLjI4aC0zLjkzdjIuMjRoMi45NWMtLjMyIDEuMjYtMS4zMSAyLjIxLTIuNTggMi40OC0xLjI4LjI3LTIuNjEtLjE1LTMuNDctMS4wOWwtMS44OSAxLjA5YzEuNDcgMS41OCAzLjg2IDIuMSA1LjkyLjgzIDEuNjMtMS4wMSAyLjUyLTIuODEgMi4yOC00LjcyLS4xMS0uODQtLjUyLTEuNjEtMS4xNS0yLjE4bC0xLjY2Ljk1di4wMmMxLjE3LS4xOCAyLjE2LS45NSAyLjYzLTIuMDJsLjktMS41NXpNNi45IDguMDRsMy4xNC0xLjgxYy0uNTctMS4wOC0xLjY5LTEuNzQtMi45MS0xLjcyLTEuNjIuMDMtMy4xIDEuMDQtMy42OSAyLjUzLS41OSAxLjQ5LS4xMyAzLjE2IDEuMTUgNC4xOWwuNzEtMS4yM2MtLjc2LS43MS0xLjE0LTEuNzktLjk3LTIuODIuMTYtMS4wMy44OC0xLjg3IDEuODQtMi4xNWwxLjY5LS45N3YuMDFjLS4zMi41NS0uNjUgMS4xLS45NiAxLjY1bC0uMDEuMzJ6bTguMDEgNi41NGwtMy4xNCAxLjgxYy41NyAxLjA4IDEuNjkgMS43NCAyLjkxIDEuNzIgMS42Mi0uMDMgMy4xLTEuMDQtMy42OS0yLjUzLjU5LTEuNDkuMTMtMy4xNi0xLjE1LTQuMTlsLS43MSAxLjIzYy43Ni43MSAxLjE0IDEuNzkuOTcgMi44Mi0uMTYgMS4wMy0uODggMS44Ny0xLjg0IDIuMTVsLTEuNjkuOTd2LS4wMWMuMzItLjU1LjY1LTEuMS45Ni0xLjY1bC4wMS0uMzJ6bS02LjYtNC45bDEuODktMS4wOWMtMS40Ny0xLjU4LTMuODYtMi4xLTUuOTItLjgzLTEuNjMgMS4wMS0yLjUyIDIuODEtMi4yOCA0LjcyLjExLjg0LjUyIDEuNjEgMS4xNSAyLjE4bDEuNjYtLjk1di0uMDJjLTEuMTcuMTgtMi4xNi45NS0yLjYzIDIuMDJsLS45IDEuNTVoMy45M3YtMi4yNGgtMi45NWMuMzItMS4yNiAxLjMxLTIuMjEgMi41OC0yLjQ4IDEuMjgtLjI3IDIuNjEuMTUgMy40NyAxLjA5em01LjU1IDMuNGgtMy45NWwxLjk3LTMuNDEgMS45OCAzLjQxem0tMS44MiAyLjFsMS45NyAzLjQxIDEuOTctMy40MUgxMi4wNHptMy45Mi0zLjQxbDEuOTctMy40MS0zLjk1LjAxIDEuOTggMy40ek05LjU0IDguN0w3LjU3IDUuMjkgNS42IDguN2gzLjk0eiIvPjwvc3ZnPg==",
            "GitHub": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNMTIgMGMtNi42MjYgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAyIDMuNDM4IDkuOCA4LjIwNyAxMS4zODcuNTk5LjExMS43OTMtLjI2MS43OTMtLjU3N3YtMi4yMzRjLTMuMzM4LjcyNi00LjAzMy0xLjQxNi00LjAzMy0xLjQxNi0uNTQ2LTEuMzg3LTEuMzMzLTEuNzU2LTEuMzMzLTEuNzU2LTEuMDg5LS43NDUuMDgzLS43MjkuMDgzLS43MjkgMS4yMDUuMDg0IDEuODM5IDEuMjM3IDEuODM5IDEuMjM3IDEuMDcgMS44MzQgMi44MDcgMS4zMDQgMy40OTIuOTk3LjEwNy0uNzc1LjQxOC0xLjMwNS43NjItMS42MDQtMi42NjUtLjMwNS01LjQ2Ny0xLjMzNC01LjQ2Ny01LjkzMSAwLTEuMzExLjQ2OS0yLjM4MSAxLjIzNi0zLjIyMS0uMTI0LS4zMDMtLjUzNS0xLjUyNC4xMTctMy4xNzYgMCAwIDEuMDA4LS4zMjIgMy4zMDEgMS4yMy45NTctLjI2NiAxLjk4My0uMzk5IDMuMDAzLS40MDQgMS4wMi4wMDUgMi4wNDcuMTM4IDMuMDA2LjQwNCAyLjI5MS0xLjU1MiAzLjI5Ny0xLjIzIDMuMjk3LTEuMjMuNjUzIDEuNjUzLjI0MiAyLjg3NC4xMTggMy4xNzYuNzcuODQgMS4yMzUgMS45MTEgMS4yMzUgMy4yMjEgMCA0LjYwOS0yLjgwNyA1LjYyNC01LjQ3OSA1LjkyMS40My4zNzIuODIzIDEuMTAyLjgyMyAyLjIyMnYzLjI5M2MwIC4zMTkuMTkyLjY5NC44MDEuNTc2IDQuNzY1LTEuNTg5IDguMTk5LTYuMDg2IDguMTk5LTExLjM4NiAwLTYuNjI3LTUuMzczLTEyLTEyLTEyeiIvPjwvc3ZnPg==",
            "C": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBmaWxsPSIjMDM1OTlDIiBkPSJNMTE3LjUgMzMuNWwtNTMuNS0zMWMtMi0xLjItNC41LTEuMi02LjUgMGwtNTMuNSAzMWMtMiAxLjItMy4zIDMuMy0zLjMgNS43djYxLjhjMCAyLjQgMS4zIDQuNSAzLjMgNS43bDUzLjUgMzFjMiAxLjIgNC41IDEuMiA2LjUgMGw1My41LTMxYzItMS4yIDMuMy0zLjMgMy4zLTUuN1YzOS4yYzAtMi40LTEuMy00LjUtMy4zLTUuN3ptLTI3LjEgNTNjLTQuNCA3LjUtMTIuNyAxMi41LTIyLjEgMTIuNS0xNC4xIDAtMjUuNS0xMS40LTI1LjUtMjUuNXMxMS40LTI1LjUgMjUuNS0yNS41YzguNyAwIDE2LjQgNC40IDIxLjExMWwtOSA2LjJjLTMuMS00LjItNy41LTYuOC0xMi4xLTYuOC04LjMgMC0xNSA2LjctMTUgMTVzNi43IDE1IDE1IDE1YzUgMCA5LjgtMyAxMi41LTcuN2w5LjYgNS44eiIvPjwvc3ZnPg=="
        };
        
        // Unconditionally fix specific logos that are known to be broken/invisible
        this.data.skills.forEach(skill => {
            const name = skill.name.trim().toLowerCase();
            if (name === "chatgpt" && skill.imageUrl !== correctLogos["ChatGPT"]) {
                skill.imageUrl = correctLogos["ChatGPT"];
                skill.name = "ChatGPT";
                modified = true;
            }
            if (name === "github" && skill.imageUrl !== correctLogos["GitHub"]) {
                skill.imageUrl = correctLogos["GitHub"];
                skill.name = "GitHub";
                modified = true;
            }
            if (name === "c" && skill.imageUrl !== correctLogos["C"]) {
                skill.imageUrl = correctLogos["C"];
                skill.name = "C";
                modified = true;
            }
        });

        const requiredSkills = [
            { name: "Postman", label: "Tools", imageUrl: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
            { name: "C", label: "Language", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
            { name: "C++", label: "Language", imageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
            { name: "Arduino", label: "Hardware", imageUrl: "https://cdn.worldvectorlogo.com/logos/arduino-1.svg" }
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
