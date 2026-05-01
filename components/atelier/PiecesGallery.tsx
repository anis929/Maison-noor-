import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MonoLabel } from '@/components/ui/MonoLabel'

const pieces = [
  { code: 'PIECE N°017', year: '2023', note: 'Corne blonde marquetee' },
  { code: 'PIECE N°024', year: '2023', note: 'Corne foncee, ponts argent' },
  { code: 'PIECE N°031', year: '2024', note: 'Corne panachee, titane' },
  { code: 'PIECE N°038', year: '2024', note: 'Corne noire, or jaune 18k' },
  { code: 'PIECE N°042', year: '2024', note: 'Corne brute non polie' },
  { code: 'PIECE N°051', year: '2024', note: 'Corne et email bleu nuit' },
]

// Grid spans: creates an asymmetric mosaic
const spans = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
]

const gradients = [
  'from-corne-fonce to-noir-profond',
  'from-[#3d2010] to-corne-fonce',
  'from-noir-doux to-corne-fonce',
  'from-corne-medium to-corne-fonce',
  'from-[#1a1206] to-corne-fonce',
  'from-corne-fonce to-[#0f0705]',
]

export function PiecesGallery() {
  return (
    <section className="section-pad bg-noir-doux">
      <ScrollReveal>
        <MonoLabel className="block mb-4">Pieces Uniques</MonoLabel>
        <h2 className="font-display font-black text-5xl md:text-6xl text-creme-os mb-12 leading-none">
          L&apos;Atelier<br />en Images
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 max-w-5xl">
        {pieces.map((piece, i) => (
          <ScrollReveal
            key={piece.code}
            delay={i * 60}
            className={`${spans[i]} relative overflow-hidden group cursor-default`}
          >
            {/* Placeholder macro — replace with real images */}
            <div
              className={`w-full h-full min-h-[180px] bg-gradient-to-br ${gradients[i]} grain-overlay`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-noir-profond/0 group-hover:bg-noir-profond/50 transition-colors duration-300 flex flex-col justify-end p-4 md:p-6">
                <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <MonoLabel className="block text-creme-os">{piece.code}</MonoLabel>
                  <MonoLabel dim className="block mt-1">{piece.year} · {piece.note}</MonoLabel>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
