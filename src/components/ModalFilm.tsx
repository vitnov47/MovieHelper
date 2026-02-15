import { Modal, Button, Image, Typography, Flex } from "antd";
import useMovieContext from "../context/movie-context";

const { Text } = Typography;
const ModalFilm = () => {
  const { openModal, pickedFilm: film, closeModal } = useMovieContext();

  return (
    <Modal
      open={openModal}
      onCancel={closeModal}
      onOk={closeModal}
      footer={
        <Flex justify="space-between">
          <Button
            key="back"
            type="primary"
            onClick={closeModal}
            style={{ width: "49%" }}
          >
            В избранное
          </Button>
          <Button
            key="ok"
            type="primary"
            onClick={closeModal}
            style={{ width: "49%" }}
          >
            Добавить в подборку
          </Button>
        </Flex>
      }
    >
      {film && (
        <Flex vertical gap="middle" align="center" style={{ marginBottom: 20 }}>
          <Image src={film.posterUrl} width={200} />
          <Text strong>Описание</Text>
          <Text style={{ textAlign: "justify" }}>{film.description}</Text>
          <Flex justify="space-between" style={{ width: "100%" }}>
            <Text type="secondary">
              Год выхода: <Text>{film.year}</Text>
            </Text>
            <Text type="secondary">
              Оценка: <Text type="warning">{film.rating || "Нет оценок"}</Text>
            </Text>
          </Flex>
        </Flex>
      )}
    </Modal>
  );
};

export default ModalFilm;
