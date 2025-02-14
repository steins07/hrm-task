import React from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
  } from "@/components/ui/pagination"
import { IUser } from '@/model/AllModels';

  interface IPaginatorProps {
      users: IUser[];
      itemsPerPage: number;
      currentPage: number;
      paginate: (pageNumber: number) => void;
  }
export default function Paginator({users, itemsPerPage, currentPage, paginate}:IPaginatorProps) {
  return (
    <div className="mt-4">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              paginate(currentPage - 1)
            }}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {[...Array(Math.ceil(users.length / itemsPerPage))].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink href="#" onClick={(e) => {
              e.preventDefault();
              paginate(index + 1)
            }} isActive={currentPage === index + 1}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              paginate(currentPage + 1)
            }}
            className={
              currentPage === Math.ceil(users.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
  )
}
