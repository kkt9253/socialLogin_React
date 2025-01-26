import React, { useEffect } from "react";
import axios from "axios";

const App = () => {
  const backendUrl = "http://localhost:8080"; // 백엔드 URL

  // 페이지 로드 시 /reissue 요청으로 토큰 갱신 
  // (window.location.href 사용하여 로그인 하기에 응답헤더값을 js에서 사용할 수 없음, accessToken 가져오기 위함)
  useEffect(() => {

    console.log("useEffect 실행1");

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.log("useEffect 실행2");

      axios
        .post(`${backendUrl}/reissue`, {}, { withCredentials: true })
        .then((response) => {
          const newAccessToken = response.headers["authorization"];
          console.log("Access Token 확인:", newAccessToken);
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            console.log("Access Token 갱신 완료:", newAccessToken);
          } else {
            console.error("Access Token 갱신 실패");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // 401 Unauthorized 처리
          
            alert("로그인이 되어 있지 않습니다. 로그인을 해주세요.");
          } else {
            console.error("알 수 없는 오류:", error);
          }
        });
    }
  }, []);

  // 네이버 로그인 요청
  const onNaverLogin = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/naver`; // 네이버 로그인 URL로 리다이렉트
  };

  // 로그아웃 처리
  const handleLogout = async () => {

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인 되어 있지 않기 때문에 로그아웃할 수 없습니다.");
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/logout`, {
        withCredentials: true, // 쿠키 포함
      });

      if (response.status === 200) {
        console.log("로그아웃 성공");
        alert("로그아웃되었습니다.");

        localStorage.removeItem("accessToken");
      } else {
        console.error("로그아웃 실패:", response);
        alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
      alert("로그아웃 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>OAuth2 네이버 로그인 및 데이터 요청</h1>
      <button onClick={onNaverLogin} style={buttonStyle}>
        NAVER LOGIN
      </button>
      <TestButton backendUrl={backendUrl} />
      <MainButton backendUrl={backendUrl} />
      <button onClick={handleLogout} style={buttonStyle}>
        LOGOUT
      </button>
    </div>
  );
};

const TestButton = ({ backendUrl }) => {
  const TestData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Access Token이 없습니다.");
        return;
      }

      const response = await axios.get(`${backendUrl}/test`, {
        headers: {
          Authorization: `${accessToken}`, // Bearer 포함
        },
        withCredentials: true,
      });

      console.log("응답 데이터 (/test):", response.data);
      alert(`응답 데이터: ${response.data}`);
    } catch (error) {
      console.error("데이터 요청 실패:", error);
      alert("데이터 요청에 실패했습니다.");
    }
  };

  return (
    <button onClick={TestData} style={buttonStyle}>
      TEST 요청
    </button>
  );
};

const MainButton = ({ backendUrl }) => {
  const MainData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Access Token이 없습니다. 다시 로그인하세요.");
        return;
      }

      const response = await axios.get(`${backendUrl}/`, {
        headers: {
          Authorization: `${accessToken}`, // Bearer 포함
        },
        withCredentials: true,
      });

      console.log("응답 데이터 (/):", response.data);
      alert(`응답 데이터: ${response.data}`);
    } catch (error) {
      console.error("데이터 요청 실패 (/):", error.message);
      alert("데이터 요청에 실패했습니다.");
    }
  };

  return (
    <button onClick={MainData} style={buttonStyle}>
      HOME 요청
    </button>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  margin: "10px",
  backgroundColor: "blue",
  color: "white",
};

export default App;