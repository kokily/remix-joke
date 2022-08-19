function NewJokeRoute() {
  return (
    <div>
      <p>당신만의 재밌는 농담을 추가해보세요!</p>

      <form method="post">
        <div>
          <label>
            이름:
            <input type="text" name="name" />
          </label>
        </div>

        <div>
          <label>
            내용:
            <textarea name="content" />
          </label>
        </div>

        <div>
          <button type="submit" className="button">
            추가
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewJokeRoute;
