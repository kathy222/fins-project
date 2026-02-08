// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ Ορίζουμε το base path όπως το ζήτησε ο καθηγητής.
  // Αυτό σημαίνει ότι το site θα αναζητά τα αρχεία του στο /FINS/
  base: '/FINS/', 

  server: {
    // ✅ Το σωστό port σύμφωνα με το link που σου έδωσε
    port: 5173, 
    host: true,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})