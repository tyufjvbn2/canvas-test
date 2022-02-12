import React, {useEffect, forwardRef} from "react"

const Canvas = forwardRef(({height, width, startPaint, paint, exitPaint, checkState, selectPolygon}, ref) => {
    useEffect(() => {
        if(!ref.current) {
          return;
        }
        const canvas = ref.current;

        if(!checkState) {
            canvas.addEventListener("mousedown", startPaint);
            canvas.addEventListener("mousemove", paint);
            window.addEventListener('mouseup', exitPaint);
        
            return () => {
              canvas.removeEventListener('mousedown', startPaint);
              canvas.removeEventListener('mousemove', paint);
              window.removeEventListener('mouseup', exitPaint);
            }
        }
        else {
            canvas.addEventListener("mousedown", selectPolygon)
        }
    
      }, [startPaint, paint, exitPaint])


    return (
        <>
            <canvas ref={ref} height={height} width={width}></canvas>
        </>
    )
})

export default Canvas;