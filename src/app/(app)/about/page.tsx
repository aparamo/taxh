'use client';

import { motion } from 'motion/react';
import { ExternalLink, BookOpen, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-game-background-darker text-white">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre el Juego</h1>
          <p className="text-xl text-gray-400">
            Un simulador educativo sobre corrupción internacional y lavado de dinero
          </p>
        </motion.div>

        {/* Game Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-game-background-dark border-gray-800 p-6 md:p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-white">¿Qué es este juego?</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                <strong>Paraísos Fiscales</strong> es un simulador educativo que te permite experimentar 
                los mecanismos y consecuencias del lavado de dinero y la corrupción internacional, 
                basado en casos reales documentados por organizaciones de investigación.
              </p>
              <p>
                El juego simula diferentes paraísos fiscales, mecanismos de lavado de dinero, 
                y las consecuencias de estas actividades. Todo el contenido está fundamentado 
                en investigaciones reales de periodistas y organizaciones internacionales.
              </p>
              <p className="text-sm text-gray-400 italic">
                Este es un juego educativo. No promueve ni justifica actividades ilegales. 
                Su propósito es educar sobre cómo funcionan estos sistemas en la realidad.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Sources Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-game-background-dark border-gray-800 p-6 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-white">Fuentes de Información</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-primary-400">Organizaciones Clave</h3>
                <div className="space-y-3">
                  <div className="bg-game-background-darker p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2 text-white">Tax Justice Network (TJN)</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Índice de Secreto Financiero - Clasificación de paraísos fiscales y mecanismos de evasión
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-400 hover:text-gray-500 p-0 h-auto"
                      onClick={() => window.open('https://taxjustice.net', '_blank')}
                    >
                      taxjustice.net <ExternalLink className="w-3 h-3 ml-1 inline" />
                    </Button>
                  </div>

                  <div className="bg-game-background-darker p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2 text-white">International Consortium of Investigative Journalists (ICIJ)</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Investigaciones: Panama Papers, Paradise Papers, Pandora Papers, Luanda Leaks, 1MDB
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-400 hover:text-gray-500 p-0 h-auto"
                      onClick={() => window.open('https://icij.org', '_blank')}
                    >
                      icij.org <ExternalLink className="w-3 h-3 ml-1 inline" />
                    </Button>
                  </div>

                  <div className="bg-game-background-darker p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2 text-white">Transparency International (TI)</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Índice de Percepción de Corrupción - Datos sobre corrupción y captura del estado
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-400 hover:text-gray-500 p-0 h-auto"
                      onClick={() => window.open('https://transparency.org', '_blank')}
                    >
                      transparency.org <ExternalLink className="w-3 h-3 ml-1 inline" />
                    </Button>
                  </div>

                  <div className="bg-game-background-darker p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2 text-white">Global Financial Integrity (GFI)</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Flujos financieros ilícitos y mecanismos de lavado de dinero
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-400 hover:text-gray-500 p-0 h-auto"
                      onClick={() => window.open('https://gfintegrity.org', '_blank')}
                    >
                      gfintegrity.org <ExternalLink className="w-3 h-3 ml-1 inline" />
                    </Button>
                  </div>

                  <div className="bg-game-background-darker p-4 rounded-lg border border-gray-700">
                    <h4 className="font-semibold mb-2 text-white">Organized Crime and Corruption Reporting Project (OCCRP)</h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Investigaciones: Russian Laundromat, Azerbaijani Laundromat
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-400 hover:text-gray-500 p-0 h-auto"
                      onClick={() => window.open('https://www.occrp.org', '_blank')}
                    >
                      occrp.org <ExternalLink className="w-3 h-3 ml-1 inline" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Educational Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-game-background-dark border-gray-800 p-6 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-white">Contenido Educativo</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Para aprender más sobre estos temas, te recomendamos explorar:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Las investigaciones de ICIJ sobre Panama Papers, Paradise Papers y Pandora Papers</li>
                <li>El Índice de Secreto Financiero de Tax Justice Network</li>
                <li>Los informes de Transparency International sobre corrupción</li>
                <li>Las investigaciones de OCCRP sobre redes criminales internacionales</li>
              </ul>
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-primary-500/20"
                  onClick={() => window.open('https://www.icij.org/investigations/', '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Ver todas las investigaciones de ICIJ
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-primary-500/20"
                  onClick={() => window.open('https://fsi.taxjustice.net', '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Explorar el Índice de Secreto Financiero
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-400 hover:text-white hover:bg-primary-500/20"
                  onClick={() => window.open('https://www.transparency.org/en/cpi', '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Ver el Índice de Percepción de Corrupción
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Methodology Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-primary-500/10 border-primary-500/30 p-6 md:p-8 text-white">
            <h3 className="text-lg font-semibold mb-3 text-primary-400">Metodología</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Los datos de países, mecanismos y características en el juego están basados en 
              investigaciones documentadas y reportes oficiales. Los puntajes de secreto financiero 
              provienen del Financial Secrecy Index 2023 de Tax Justice Network. Los casos reales 
              mencionados provienen de investigaciones verificadas por periodistas y organizaciones 
              internacionales de investigación.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

