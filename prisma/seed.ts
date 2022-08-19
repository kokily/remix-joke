import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getJokes().map((joke) => {
      return db.joke.create({ data: joke });
    })
  );
}

seed();

function getJokes() {
  return [
    {
      name: '바비큐',
      content: `돼지가 열받으면 어떻게 될까?`,
    },
    {
      name: '보석바',
      content: `도둑이 제일 좋아하는 아이스크림은?`,
    },
    {
      name: '시험문제',
      content: `많이 맞을수록 좋은 것은?`,
    },
    {
      name: '괜히 일어났네',
      content: `넘어진 펭귄이 일어나서 걷다 또 넘어졌다. 뭐라 했을까?`,
    },
    {
      name: '과',
      content: `무릎과 무릎 사이에 있는 것은 무엇일까요?`,
    },
    {
      name: '기술',
      content: `먹고 살기 위해 한 가지씩 배워 두면 좋은 술은?`,
    },
    {
      name: '불고기',
      content: `물고기의 반대말은?`,
    },
  ];
}
