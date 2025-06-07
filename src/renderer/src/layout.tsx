// import { useEffect, useState } from 'react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from './components/AppSidebar'
import { Separator } from './components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './components/ui/breadcrumb'
import { Fragment } from 'react/jsx-runtime'
import { Link, useLocation } from 'react-router-dom'

const toTitle = (str: string): string =>
  str.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(Boolean)

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 flex-1 w-full">
        <div className="flex h-5 items-center space-x-4 text-sm">
          <SidebarTrigger />
          <Separator orientation="vertical" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {pathnames.map((segment, i) => {
                const to = '/' + pathnames.slice(0, i + 1).join('/')
                const isLast = i === pathnames.length - 1

                return (
                  <Fragment key={to}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{toTitle(segment)}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={to}>{toTitle(segment)}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
