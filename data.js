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

class PortfolioDataManager {
    constructor() {
        this.storageKey = 'portfolio_data_v2'; // new version for new schema
        this.data = this.loadData();
    }

    loadData() {
        const savedData = localStorage.getItem(this.storageKey);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error("Error parsing saved portfolio data:", e);
                return defaultPortfolioData;
            }
        }
        return JSON.parse(JSON.stringify(defaultPortfolioData)); // clone default
    }

    saveData(newData) {
        try {
            const dataString = JSON.stringify(newData);
            localStorage.setItem(this.storageKey, dataString);
            this.data = newData;
        } catch (e) {
            console.error("Error saving to local storage", e);
            alert("Failed to save! Your images might be taking up too much space. Please try a smaller image or use an Image URL.");
        }
    }

    getData() {
        return this.data;
    }
}

// Global Instance
window.portfolioManager = new PortfolioDataManager();
