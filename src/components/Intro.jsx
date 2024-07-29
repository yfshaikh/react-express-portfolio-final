import React from 'react'

const texts = ['Computer Science', 'Machine Learning', 'Software Engineering', 'Fullstack Development'];

function Intro({title}) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000, // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, [])



  return (
    <div>
        <h1 id="intro">{title}</h1>
        <h2 className="subtitle">A <span id="alternating-text">{texts[index % texts.length]}</span> Enthusiast</h2>        
    </div>
  )
}

export default Intro

