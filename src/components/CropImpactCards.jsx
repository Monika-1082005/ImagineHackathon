import PropTypes from 'prop-types';
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import img1 from '../images/Crop1.jpg';
import img2 from '../images/Crop2.jpg';
import img3 from '../images/Crop3.jpg';
import img4 from '../images/Crop4.webp';
import img5 from '../images/Crop5.avif';

const cropImpacts = [
  {
    title: "Reduced Crop Yields",
    description:
      "The yield of major crops such as wheat, rice, and maize is declining due to heat stress and irregular rainfall. Studies suggest a 2.5-4.5% reduction in yield for every 1°C increase in temperature. This reduction impacts not only the global food supply but also local economies reliant on agriculture. Smallholder farmers are particularly vulnerable, as they struggle to adapt to shifting climate patterns.",
    img: img1,
  },
  {
    title: "Shift in Crop Growing Seasons",
    description:
      "Global warming is altering the growing seasons for crops like wheat and mustard, which typically thrive in cooler climates. With rising temperatures, crops are experiencing delayed sowing and early maturation, which reduces overall productivity. This shift in timing challenges farmers' ability to optimize harvests and manage seasonal agricultural practices, affecting food security.",
    img: img2,
  },
  {
    title: "Increased Pest and Disease Incidences",
    description:
      "Rising temperatures and humidity levels create favorable conditions for pests such as brown plant hoppers in rice and diseases like wheat rust. These pests and diseases can devastate crops, leading to significant yield losses. The increased prevalence of these threats complicates pest management strategies, especially in regions where farmers lack the resources for effective control.",
    img: img3,
  },
  {
    title: "Water Stress",
    description:
      "Approximately 80% of India’s agriculture is rain-fed, and erratic monsoons have caused frequent droughts and water shortages. These water stress conditions are worsening as climate change impacts rainfall patterns and availability. Inadequate irrigation infrastructure, coupled with shifting rainfall distribution, exacerbates the vulnerability of farming communities to water scarcity.",
    img: img4,
  },
  {
    title: "Quality Decline in Fruits and Vegetables",
    description:
      "Crops like mango, grapes, and apples are facing quality degradation due to higher temperatures. These changes affect flowering, fruiting, and ripening, leading to reduced market quality and lower consumer demand. This degradation also impacts the economic viability of farms that rely on high-quality produce for export and local markets, resulting in financial losses for farmers.",
    img: img5,
  },
];

const CropImpactCard = ({
  i,
  title,
  description,
  img,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="w-screen h-screen pointer-events-none flex justify-center items-center sticky top-0"
    >
      <motion.div
        className="relative h-2/3 w-full rounded-xl px-5"
        style={{
          scale,
          top: `calc(5vh + ${i * 30}px)`,
        }}
      >
        <div className="lg:grid grid-cols-3 lg:h-full shadow-[0_0px_50px_-15px_#354340] rounded-xl">
          <div className="flex flex-col justify-center items-center text-stone-900 bg-stone-100 rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl h-full">
            {/* Updated Title - vertically centered */}
            <h2 className="text-3xl lg:text-5xl font-bold text-center leading-tight">
              {title.split(" ").map((word, index) => (
                <span key={index} className="block">{word}</span>
              ))}
            </h2>
          </div>
          <div className="h-64 lg:h-full w-full overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
              }}
              className="h-full"
            ></motion.div>
          </div>
          <div className="flex flex-col justify-between rounded-b-xl lg:rounded-r-xl bg-stone-100 text-stone-900 uppercase font-bold">
  <div className="flex flex-col justify-center items-center h-full p-5">
    <p className="text-sm lg:text-base text-center">{description}</p>
  </div>
</div>
        </div>
      </motion.div>
    </div>
  );
};

CropImpactCard.propTypes = {
  i: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  progress: PropTypes.object.isRequired,
  range: PropTypes.arrayOf(PropTypes.number).isRequired,
  targetScale: PropTypes.number.isRequired,
};

const CropImpactCards = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      id="crop-impact"
      ref={containerRef}
      className="w-screen relative rounded-t-3xl py-10 lg:py-20"
      style={{
        // background:
        //   "url('/noise.png'), linear-gradient(#2e8b57, #228b22, #7cfc00)",
        backgroundRepeat: "round",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className="flex justify-center items-center sticky top-0">
        {/* Display the "Crop Impacts" text as normal without any wave effect */}
        <h1 className="text-xl lg:text-[40px] text-black font-bold uppercase">
        Global Warming: Silent War on Agriculture
        </h1>
      </div>

      {cropImpacts.map((impact, i) => {
        const targetScale = 1 - (cropImpacts.length - i) * 0.05;
        return (
          <CropImpactCard
            key={`impact_${i}`}
            i={i}
            {...impact}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
};

export default CropImpactCards;
