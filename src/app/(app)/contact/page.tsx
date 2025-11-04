'use client';

import { motion } from 'motion/react';
import { Mail, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-game-background-darker text-white">
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-xl text-gray-400">
            ¿Tienes preguntas o comentarios?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-game-background-dark border-gray-800 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-gray-400">
                    Si tienes preguntas sobre el juego, sugerencias o comentarios, 
                    puedes contactarnos por email.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageSquare className="w-6 h-6 text-primary-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Feedback</h3>
                  <p className="text-gray-400">
                    Tu opinión es importante para nosotros. Si encuentras algún error 
                    o tienes ideas para mejorar el juego, estaríamos encantados de escucharte.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-500">
                  Este es un proyecto educativo independiente. Para información sobre 
                  las fuentes y metodología utilizada, consulta la página 
                  <a href="/about" className="text-primary-400 hover:text-primary-300 ml-1">
                    Sobre el Juego
                  </a>.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

