import './App.css';
import React, {useRef, useState, useCallback} from "react"
import List from "./List"
import Canvas from './Canvas';

function App() {
  const canvasRef = useRef(null);
  const defaultOpt = {
    height: 800,
    width: 600
  }

  //state
  const [pointer, setPointer] = useState(undefined);
  const [isPainting, setIsPainting] = useState(false);
  const [startPoint, setStartPoint] = useState(undefined);
  const [streamContext, setStreamContext] = useState(undefined);
  const [polygonStore, setPolygonStore] = useState([]);
  const [isChecked, setIsChecked] = useState(false)

  //x,y position
  const getPosition = (e) => {
    if(!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    return {
      x: e.pageX - canvas.offsetLeft,
      y: e.pageY - canvas.offsetTop
    };
  }

  //draw line func
  const drawLine = (originPointer, newPointer, polygon) => {
    if(!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if(context) {
      context.strokeStype ="red";
      context.lineJoin="round";
      context.lineWidth = 1;

      // context.beginPath();
      polygon.moveTo(originPointer.x, originPointer.y);
      polygon.lineTo(newPointer.x, newPointer.y);
      
      setStreamContext(polygon)
      context.stroke(polygon);
      
      // console.log("cxt data", streamContext)
    }
  }

  const startPaint = useCallback((e) => {
    console.log("clicked")
    const position = getPosition(e);

    if(position) {
      if(!startPoint) {
        setStartPoint(position)
      }
      setIsPainting(true)
      setPointer(position)
      let polygon = new Path2D();
      setStreamContext(polygon)
    }
  }, []);

  const paint = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("drawing")

    if(isPainting) {
      const newPointer = getPosition(e);

      if(pointer && newPointer) {
        drawLine(pointer, newPointer, streamContext);
        // setStreamContext([...streamContext, contextData])
        setPointer(newPointer);
      }
    }
    else if (streamContext) {
      const lastPointer = getPosition(e);
      drawLine(startPoint, lastPointer, streamContext);
      setPolygonStore((polygonStore) => {return [...polygonStore, streamContext]})
      setStreamContext(undefined)
      setStartPoint(undefined);
    }
  }, [isPainting, pointer, streamContext, startPoint]);

  const exitPaint = useCallback((e) => {
    console.log("stop")
    if(startPoint) {
      setIsPainting(false);
      // const lastPointer = getPosition(e);
      // drawLine(startPoint, lastPointer, streamContext);
      // console.log("stream context data", streamContext)
      // console.log("polygon arr", polygonStore)
      // setStartPoint(undefined)
    }
    // else {
    //   setPolygonStore((polygonStore) => {return [...polygonStore, streamContext]})
    //   setStreamContext(undefined)
    // }

  }, [startPoint])

  // useEffect(() => {
  //   if(!canvasRef.current) {
  //     return;
  //   }
  //   const canvas = canvasRef.current;

  //   // canvas.addEventListener("mousedown", startPaint);
  //   // canvas.addEventListener("mousemove", paint);
  //   // window.addEventListener('mouseup', exitPaint);

  //   return () => {
  //     // canvas.removeEventListener('mousedown', startPaint);
  //     // canvas.removeEventListener('mousemove', paint);
  //     // window.removeEventListener('mouseup', exitPaint);
  //   }
  // }, [])

  function selectPolygon () {

  }

  function deletePolygon (index) {
    removeDrawing(polygonStore[index])
    setPolygonStore(polygonStore => polygonStore.filter((el,i) => {if(i !== index) return el}))
  }

  function removeDrawing (array) {
    array.forEach(element => {
      element.fillStyle ="white";
    });
  }

  function handleCheck(e) {
    setIsChecked(e.target.checked)
    console.log("check state", e.target.checked)
  }

  return (
    <>
    <label htmlFor='checkbox'>Delete Mode</label>
    <input type="checkbox" id='checkbox' name="checkbox" onChange={handleCheck} />
    <div className='canvas'>
      <Canvas ref={canvasRef} height={defaultOpt.height} width={defaultOpt.width} startPaint={startPaint} exitPaint={exitPaint} paint={paint} checkState={isChecked} selectPolygon={selectPolygon} />
    </div>
    <div id="list">
      <List polygonStore={polygonStore} deletePolygon={deletePolygon}/>
    </div>
    </>
  );
}

export default App;
