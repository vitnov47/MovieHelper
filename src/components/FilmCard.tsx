import type { Movie } from "../types/movie";
import defaultPoster from "../assets/poster_not_found.png";
import "../styles/card.css";
import useMovieContext from "../context/movie-context";

interface FilmCardProps {
  film: Movie;
}

const FilmCard = ({ film }: FilmCardProps) => {
  const { pickMovie } = useMovieContext();
  return (
    <div className="film-card" onClick={() => pickMovie(film)}>
      <div className="poster-wrapper">
        <img
          src={film.posterUrlPreview}
          alt={film.nameRu}
          className="poster-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== defaultPoster) target.src = defaultPoster;
          }}
        />
      </div>
      <h3 className="film-title">{film.nameRu || film.nameEn}</h3>
      <div className="film-year">
        {film.year != "null" ? film.year : "Год неизвестен"}
      </div>
    </div>
  );
};

export default FilmCard;
