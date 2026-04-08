# 🗓️ Interactive Wall Calendar

A premium, fully interactive wall calendar component built with **React.js** and **TypeScript**, designed to deliver a real-world product experience with clean architecture, smooth UX, and responsive design.

---

## 🚀 Live Demo
calendar-companion-ashy.vercel.app

### 📅 Calendar & Navigation

* Monthly calendar with correct date alignment
* Highlight for today’s date
* Previous / Next month navigation
* Quick month & year picker

### 🎯 Date Range Selection

* Select start and end dates
* Visual distinction for:

  * Start date
  * End date
  * Dates in between
* Smart hover preview before selection
* Drag-to-select range support

### 📝 Notes System

* Add notes for:

  * Entire month
  * Selected date range
* Persistent storage using localStorage

### 🖼 Dynamic Hero Images

* Unique image for each month
* Smooth fade transitions between months
* Subtle zoom/parallax effect
* Gradient overlay for readability

### 🎨 Dynamic Theme

* Theme colors adapt based on hero image
* Consistent UI styling across components

### 🎉 Events / Holidays

* Indicators on specific dates
* Tooltip display for events

### ⏳ Loading & Feedback

* Skeleton loader during month transitions
* Smooth animations and micro-interactions

### 🔄 State Persistence

* Saves:

  * Selected date range
  * Current month
  * Notes
  * Theme preference

### ♿ Accessibility

* Full keyboard navigation:

  * Arrow keys → move between dates
  * Enter/Space → select
  * Shift + arrows → extend range
* ARIA roles for screen readers
* Focus visibility maintained

### 🌙 Dark Mode

* Light / Dark theme toggle
* Persists user preference

### 📱 Fully Responsive

* Desktop: Split layout (image + calendar + notes)
* Mobile: Stacked layout with touch-friendly interactions

---

## 🧱 Tech Stack

* **React / Next.js**
* **TypeScript**
* **Tailwind CSS**
* **Custom Hooks**
* **localStorage (for persistence)**

---

 📁 Project Structure
/components
  Calendar.tsx
  DateCell.tsx
  Header.tsx
  MonthPicker.tsx
  NotesPanel.tsx
  Skeleton.tsx

/hooks
  useCalendar.ts
  useDateRange.ts
  useLocalStorage.ts
  useThemeFromImage.ts

/utils
  dateHelpers.ts
  monthImages.ts
  events.ts

/types
  index.ts

⚙️ How to Run Locally
1️⃣ Clone the Repository

bash
git clone  https://github.com/gokulakannan18/calendar-companion.git
cd calendar-companion

2️⃣ Install Dependencies

bash
npm install

or

bash
yarn install

3️⃣ Start Development Server

bash
npm run dev

or

bash
yarn dev

4️⃣ Open in Browser

Visit:
http://localhost:3000

🧪 Build for Production
npm run build
npm start

🎯 Key Highlights

* Clean, scalable architecture
* Reusable component design
* Strong focus on UX/UI
* Performance-optimized rendering
* Production-ready code quality

🚀 Future Improvements

* Backend integration for cloud sync
* Multi-user collaboration
* Calendar export (Google / iCal)
* Drag-and-drop event creation

Author
GitHub: https://github.com/gokulakannan18


