import { GetServerSideProps, GetServerSidePropsContext } from 'next'

const hasAuth = (ctx: GetServerSidePropsContext): boolean => (!!ctx.req.cookies['access-token'] || !!ctx.req.cookies['refresh-token'])

export interface AuthServerSideProps extends GetServerSideProps {}

export const withAuth: GetServerSideProps = async (ctx) => {
  // If authenticated, return empty props
  if (hasAuth(ctx)) return { props: {} }

  // If not authenticated, redirect to login page
  return {
    redirect: {
      permanent: false,
      destination: '/login',
    }
  }
}

export const withOutAuth: GetServerSideProps = async (ctx) => {
  // If authenticated, redirect to home page
  if (hasAuth(ctx)) return {
    redirect: {
      permanent: false,
      destination: '/profile',
    }
  }

  // If not authenticated, return empty props
  return { props: {} }
}
