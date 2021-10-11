export default class APIHandler {
  constructor() {}

  // TODO: 전체 카드 객체 리스트 반환. 없으면 NULL
  async getCards() {
    const request = new APIRequest("GET", "/kanban/cards");
    const response = await APIProcessor(request);
    if (response !== "Error") {
      return response.Items;
    } else {
      return null;
    }
  }

  // TODO: 카드 객체 생성/추가 후 ID 반환
  async postCard(cardObj) {
    const request = new APIRequest("POST", "/kanban/cards", {
      title: cardObj.title,
      category: cardObj.category,
    });
    const response = await APIProcessor(request);

    if (response !== "Error") {
      console.log(response);
      return response.id;
    } else {
      return null;
    }
  }

  // TODO: ID로 카드 검색 후 내용,카테고리 수정
  async putCard(cardObj) {
    const request = new APIRequest("PUT", "/kanban/cards/${cardObj.id}", {
      title: cardObj.title,
      category: cardObj.category,
    });
    const response = await APIProcessor(request);

    if (response !== "Error") {
      console.log(response);
    } else {
      return null;
    }
  }

  // TODO: ID로 카드 검색 후 삭제
  async deleteCard(id) {
    const request = new APIRequest("DELETE", "/kanban/cards/${id}");
    const response = await APIProcessor(request);

    if (response !== "Error") {
      console.log(response);
    } else {
      return null;
    }
  }
}

const HOST = "https://qjr7nkgq62.execute-api.ap-northeast-2.amazonaws.com/prod";

// TODO: API 요청 컨테이너. Method, Path, Body 속성
class APIRequest {
  constructor(method, path, body = null) {
    this.method = method;
    this.url = HOST + path;
    this.body = body;
  }
}

// TODO: API 호출 함수
const APIProcessor = async (request) => {
  try {
    const response = await fetch(request.url, {
      method: request.method,
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: request.body ? JSON.stringify(request.body) : null,
    });
    switch (response.status) {
      case 200:
      case 201:
        return await response.json();
      case 204:
        return null;
      default:
        console.error(await response.json());
    }
  } catch (e) {
    console.error(e);
  }
  return "Error";
};
