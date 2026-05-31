# Fibertoy
An app for building and sharing React Three Fiber scenes with the world.

## Setup
To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/NabilNYMansour/fibertoy
cd fibertoy
chmod +x install.sh
./install.sh
```

Make sure you have the environment variables set up in your `.env.local` file. You can copy the `.env.local.example` file to `.env.local` and fill in the values.
```bash
cp hub/.env.local.example hub/.env.local
```

Then to run the dev server:

```bash
chmod +x dev.sh
./dev.sh
```

This will run the nextjs development server, the vite editor and the convex backend
