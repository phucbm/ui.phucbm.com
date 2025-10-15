"use client"
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import './infinite-grid.css'
import { Observer } from 'gsap/Observer';

const InfiniteGrid = () => {
     const scope = useRef<HTMLElement | null>(null);
     
     useEffect(() => {
          if ('scrollRestoration' in history) {
               history.scrollRestoration = 'manual'
          }
          gsap.registerPlugin(Observer);

          const initEffect = () => {
               const root = scope.current;
               if (!root) return;

               const container = root.querySelector('.container1') as HTMLElement;
               if (!container) return;

               const wrapper = root.querySelector('.wrapper') as HTMLElement;
               if (!wrapper) return;

               const closestWrapper = root.closest('.outer-wrapper');
               console.log('Closest wrapper element:', closestWrapper);

               // Wrap helpers
               const halfX = wrapper.clientWidth / 2;
               const wrapX = gsap.utils.wrap(-halfX, 0);
               const xTo = gsap.quickTo(wrapper, 'x', {
                    duration: 1.5,
                    ease: 'power4',
                    modifiers: { x: gsap.utils.unitize(wrapX) }
               });

               const halfY = wrapper.clientHeight / 2;
               const wrapY = gsap.utils.wrap(-halfY, 0);
               const yTo = gsap.quickTo(wrapper, 'y', {
                    duration: 1.5,
                    ease: 'power4',
                    modifiers: { y: gsap.utils.unitize(wrapY) }
               });

               const scaleToX = gsap.quickTo(container, 'scaleX', {
                    duration: 1.5,
                    ease: 'power4',
               });

               const scaleToY = gsap.quickTo(container, 'scaleY', {
                    duration: 1.5,
                    ease: 'power4',
               });

               // State
               let incrX = 0, incrY = 0;
               let interactionTimeout: NodeJS.Timeout;
               // GSAP Observer (wheel + touch + drag)
               const gsapObserver = Observer.create({
                    target: closestWrapper,
                    type: "wheel,touch,pointer",
                    onChangeX: (self) => {
                         if (self.event.type === "wheel") {
                              incrX -= self.deltaX;
                         } else {
                              incrX += self.deltaX * 2;
                         }
                    
                         xTo(incrX);
                    
                         // Limit how much the container can shrink
                         const rawScale = 1 - self.deltaX / 200;
                         const safeScale = gsap.utils.clamp(0.8, 1.2, rawScale); // 🔒 keep between 0.8 → 1.2
                         scaleToX(safeScale);
                    
                         window.clearTimeout(interactionTimeout);
                         interactionTimeout = setTimeout(() => scaleToX(1), 66);
                    },
                    onChangeY: (self) => {
                         if (self.event.type === "wheel") {
                              incrY -= self.deltaY;
                         } else {
                              incrY += self.deltaY * 2;
                         }
                    
                         yTo(incrY);
                    
                         // Limit Y-scale shrink as well
                         const rawScale = 1 - self.deltaY / 200;
                         const safeScale = gsap.utils.clamp(0.8, 1.2, rawScale);
                         scaleToY(safeScale);
                    
                         window.clearTimeout(interactionTimeout);
                         interactionTimeout = setTimeout(() => scaleToY(1), 66);
                    },
                    
                    preventDefault: true, // another GSAP shortcut
               });

               // Kill when root removed
               const observer = new MutationObserver(mutations => {
                    const isRootRemoved = mutations.some(mutation =>
                         mutation.type === 'childList' &&
                         Array.from(mutation.removedNodes).includes(root as Node)
                    );
                    if (isRootRemoved) {
                         gsapObserver.kill();
                         observer.disconnect();
                    }
               });
               observer.observe(document.body, { childList: true, subtree: true });
          };


          const onLoad = () => initEffect()

          if (document.readyState === 'complete') {
               initEffect()
          } else {
               window.addEventListener('load', onLoad, { once: true })
          }

          return () => {
               window.removeEventListener('load', onLoad)
          }
     }, []);


     return (
          <section className="mwg_effect026" ref={scope}>
               <div className="container1">
                    <div className="wrapper"
                    >
                         <div className="content">
                              <div className="media"><img src="/InfiniteGrid/medias/12.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/02.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/03.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/04.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/05.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/06.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/07.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/08.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/09.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/10.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/11.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/01.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/13.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/14.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/15.png" alt="" /></div>
                         </div>
                         <div className="content" aria-hidden="true">
                              <div className="media"><img src="/InfiniteGrid/medias/12.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/02.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/03.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/04.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/05.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/06.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/07.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/08.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/09.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/10.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/11.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/01.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/13.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/14.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/15.png" alt="" /></div>
                         </div>
                         <div className="content" aria-hidden="true">
                              <div className="media"><img src="/InfiniteGrid/medias/12.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/02.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/03.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/04.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/05.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/06.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/07.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/08.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/09.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/10.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/11.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/01.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/13.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/14.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/15.png" alt="" /></div>
                         </div>
                         <div className="content" aria-hidden="true">
                              <div className="media"><img src="/InfiniteGrid/medias/12.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/02.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/03.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/04.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/05.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/06.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/07.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/08.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/09.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/10.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/11.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/01.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/13.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/14.png" alt="" /></div>
                              <div className="media"><img src="/InfiniteGrid/medias/15.png" alt="" /></div>
                         </div>
                    </div>
               </div>
          </section>
     )
}

export default InfiniteGrid