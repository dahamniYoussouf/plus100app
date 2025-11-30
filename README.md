# Next.js Interactive Portfolio

A modern, interactive portfolio website built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. This portfolio showcases professional experience in Agentforce, Salesforce, WordPress, and Full Stack Development.

## Features

- 🎨 **Modern UI/UX** - Beautiful, responsive design with smooth animations
- ⚡ **Interactive** - Smooth scrolling, hover effects, and scroll-triggered animations
- 📱 **Responsive** - Fully responsive design that works on all devices
- 🚀 **Fast** - Built with Next.js 14 for optimal performance
- 🎭 **Animations** - Powered by Framer Motion for smooth, engaging interactions
- 💼 **Professional** - Showcases experience in Agentforce, Salesforce, WordPress, and Full Stack Development

## Sections

1. **Hero** - Eye-catching introduction with call-to-action buttons
2. **About** - Personal introduction and professional background
3. **Experience** - Detailed work experience with technologies used
4. **Skills** - Interactive skill bars and technology expertise
5. **Contact** - Contact form and social media links

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Customization

### Update Personal Information

1. **Contact Information**: Edit `components/Contact.tsx` to update email, LinkedIn, and GitHub links
2. **Experience**: Modify the `experiences` array in `components/Experience.tsx`
3. **Skills**: Update the `skillCategories` array in `components/Skills.tsx`
4. **About Section**: Edit the content in `components/About.tsx`

### Styling

- Global styles: `app/globals.css`
- Tailwind configuration: `tailwind.config.ts`
- Color scheme can be customized in the Tailwind config

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Skills.tsx
│   └── Contact.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## License

This project is open source and available under the MIT License.





