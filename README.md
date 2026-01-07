# Aura - Event Photo Journal

Aura is a modern, real-time shared photo gallery application designed for events. It allows guests to instantly upload and view photos in a live feed, which can then be automatically compiled into a beautifully designed, editorial-style digital PDF journal.

## ✨ Features

- **Real-time Photo Feed**: Instantly view photos shared by guests as they happen (powered by Supabase Realtime).
- **Instant Uploads**: Seamless photo uploading from mobile devices with compression and optimization.
- **Editorial PDF Generation**: Automatically generates a "Digital Journal" of the event.
  - **Dynamic Layouts**: Intelligently mixes layouts (Impact, Mosaic, Minimalist) for a magazine-like feel.
  - **Styles**: Premium aesthetic with cream backgrounds, serif typography, and shadow effects.
- **Event Privacy**: Optional password protection for private events.
- **Interaction**: Like photos and see popular moments.
- **Owner Controls**: Device-based ownership allows users to delete their own photos.

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database & Storage**: [Supabase](https://supabase.com/)
- **Styling**: TailwindCSS & Custom CSS for PDF generation
- **PDF Engine**: `jspdf` & `html2canvas`
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚀 Getting Started

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env.local` file with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components (PhotoFeed, CameraModal, etc.).
- `/lib`: Utilities, including the complex `journal.ts` for PDF generation logic.

## 🎨 Design Philosophy

Aura focuses on a "Premium Minimalist" aesthetic, utilizing plenty of whitespace, high-quality typography (Playfair Display & Lato), and subtle animations to create an elegant user experience suitable for weddings and high-end events.
