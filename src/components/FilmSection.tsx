import { useState } from "react";
import {
  Carousel,
  Row,
  Col,
  Button,
  Typography,
  Grid,
  ConfigProvider,
  theme,
} from "antd";
import type { Movie } from "../types/movie";
import FilmCard from "./FilmCard";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface CarouselFilmsProps {
  title: string;
  films: Movie[];
  isLoading: boolean;
}

const { useBreakpoint } = Grid;
const cardScrollVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
    },
  },
};

const FilmSection = ({ title, films, isLoading }: CarouselFilmsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const screens = useBreakpoint();

  if (!isLoading && (!films || films.length === 0)) {
    return null;
  }

  const getSlidesToShow = () => {
    if (screens.xxl) return 6;
    if (screens.xl) return 5;
    if (screens.lg) return 4;
    if (screens.md) return 3;
    if (screens.sm) return 2;
    if (screens.xs) return 1;
    return 6;
  };

  const isArrows = () => screens.sm;

  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: Math.ceil(getSlidesToShow() / 2),
    arrows: isArrows(),
    centerMode: !screens.sm,
    centerPadding: !screens.sm ? "40px" : "0px",
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography.Title
          level={3}
          style={{
            color: "white",
            margin: 0,
            textShadow: "0 0 10px rgba(255,255,255,0.3)",
          }}
        >
          {title}{" "}
          <span style={{ fontSize: "14px", color: "gray" }}>
            ({films?.length})
          </span>
        </Typography.Title>

        {films?.length > 6 && (
          <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
            <Button ghost onClick={() => setIsExpanded((prev) => !prev)}>
              {isExpanded ? "Свернуть" : "Показать все"}
            </Button>
          </ConfigProvider>
        )}
      </div>
      <motion.div layout>
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Row gutter={[16, 24]}>
                {films?.map((f) => (
                  <Col
                    key={f.filmId || f.kinopoiskId}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    xl={4}
                  >
                    <motion.div
                      variants={cardScrollVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                    >
                      <FilmCard film={f} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          ) : (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Carousel {...carouselSettings} style={{ marginInline: 15 }}>
                {films?.map((f) => (
                  <div key={f.filmId || f.kinopoiskId}>
                    <div style={{ padding: 8 }}>
                      <FilmCard film={f} />
                    </div>
                  </div>
                ))}
              </Carousel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FilmSection;
