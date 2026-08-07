import { motion } from 'framer-motion'
import ASCIIText from '../components/ui/ASCIIText/ASCIIText'

export default function Home({ onStart }) {
  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4">
      {/* Wrapper for image + button overlap */}
      <div className="relative" style={{ width: '100%', maxWidth: 600, height: 160 }}>
        {/* Image behind button */}
        <img
          src="/ims2.webp"
          alt=""
          className="w-full rounded-2xl object-cover pointer-events-none"
          style={{ height: 160, opacity: 0.35, objectPosition: 'center 30%', filter: 'brightness(0.6) saturate(0.8)' }}
        />

        {/* Button on top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={onStart}
          className="absolute inset-0 cursor-pointer overflow-visible rounded-2xl"
          style={{
            background: 'rgba(20,10,40,0.08)',
            backdropFilter: 'blur(4px)',
            border: 'none'
          }}
        >
          <span className="web-corner" style={{position:'absolute',top:-1,left:-1,width:50,height:50,borderTop:'1px solid rgba(155,155,255,0.15)',borderLeft:'1px solid rgba(155,155,255,0.15)',borderRadius:'14px 0 0 0'}} />
          <span className="web-corner" style={{position:'absolute',top:-1,right:-1,width:50,height:50,borderTop:'1px solid rgba(155,155,255,0.15)',borderRight:'1px solid rgba(155,155,255,0.15)',borderRadius:'0 14px 0 0',animationDelay:'1s'}} />
          <span className="web-corner" style={{position:'absolute',bottom:-1,left:-1,width:50,height:50,borderBottom:'1px solid rgba(155,155,255,0.15)',borderLeft:'1px solid rgba(155,155,255,0.15)',borderRadius:'0 0 0 14px',animationDelay:'2s'}} />
          <span className="web-corner" style={{position:'absolute',bottom:-1,right:-1,width:50,height:50,borderBottom:'1px solid rgba(155,155,255,0.15)',borderRight:'1px solid rgba(155,155,255,0.15)',borderRadius:'0 0 14px 0',animationDelay:'3s'}} />

          <ASCIIText
            text="S T A R T"
            asciiFontSize={12}
            textFontSize={200}
            textColor="#fdf9f3"
            planeBaseHeight={8}
            enableWaves={false}
          />
        </motion.div>
      </div>

      <style>{`
        @keyframes webPulse {
          0%,100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }
        .web-corner {
          animation: webPulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
