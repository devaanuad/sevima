import PageTitle from "../../components/Typography/PageTitle";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
} from "@windmill/react-ui";
import { EditIcon, SearchIcon } from "../../icons";
import axios from "axios";
import { API_URL } from "../../components/Middleware/constants";
import UsersAccess from "../../components/Middleware/BlockUsers";
import * as Secure from "../../components/Middleware/SecureLocalStorage";

function Siswa() {
  // block login and akses role
  UsersAccess("guru");

  const [users, setUsers] = useState([]);
  const [pageTable2, setPageTable2] = useState(1);
  const [dataTable2, setDataTable2] = useState([]);
  const [loading, setLoading] = useState(false);

  // for search nya
  const [search, setSearch] = useState("");
  // pagination setup
  const resultsPerPage = 10;
  const totalResults = users.length;

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p);
  }

  const getUsers = async () => {
    const response = await axios.get(API_URL + "api/guru/user", {
      withCredentials: true,
      headers: {
        Authorization: `${Secure.getItem("token")}`,
      },
    });
    setUsers(response.data.data);
    setLoading(true);
  };

  // dapetin data user  dari function getUsers lalu set ke state setUsers
  useEffect(() => {
    getUsers();
  }, []);

  // ketika ada perubahan di state user ,maka set data baru ke state setDataTable2
  useEffect(() => {
    if (users.length > 0) {
      setDataTable2(
        users.slice(
          (pageTable2 - 1) * resultsPerPage,
          pageTable2 * resultsPerPage
        )
      );
    }
  }, [users]);

  // ketika ada perubahan di state dataTable2, maka render data baru yang digunakan untuk pagination mapping
  useEffect(() => {
    setDataTable2(
      users.slice(
        (pageTable2 - 1) * resultsPerPage,
        pageTable2 * resultsPerPage
      )
    );
  }, [pageTable2]);

  // Jika ada perubahan di state search ,maka tampilkan data full (tanpa pagination) untuk di filter
  useEffect(() => {
    if (search !== "") {
      setDataTable2(
        users.filter((user) =>
          user.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else if (search === "") {
      setDataTable2(
        users.slice(
          (pageTable2 - 1) * resultsPerPage,
          pageTable2 * resultsPerPage
        )
      );
    }
  }, [search]);

  return (
    <>
      <PageTitle>Data User</PageTitle>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-3  w-xl mb-5">
        <div className="relative focus-within:text-purple-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            type="text"
            className="pl-8 text-gray-700"
            placeholder="Search Data"
            aria-label="Search"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
        <div />
        <div style={{ textAlign: "right" }}>
          <Button
            className=""
            icon={EditIcon}
            aria-label="Edit"
            tag={Link}
            to={`/app/guru/siswa/buat`}
          >
            Tambah Data Pengumpulan
          </Button>
        </div>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nama Siswa</TableCell>
              <TableCell>email</TableCell>
              <TableCell>Kelas</TableCell>

              {/* <TableCell>Opsi</TableCell> */}
            </tr>
          </TableHeader>
          {loading ? (
            dataTable2.map((user) => (
              <TableBody key={user.id}>
                <TableRow>
                  <TableCell>
                    <span className="text-sm">{user.name}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">{user.email}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">{user.kelas}</span>
                  </TableCell>

                  {/* <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button
                        layout="link"
                        size="icon"
                        aria-label="Edit"
                        tag={Link}
                        to={`/app/admin/user/edit/${user.id}`}
                      >
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>

                      <Button layout="link" size="icon" aria-label="Delete">
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              </TableBody>
            ))
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="pos-center">
                    <div className="loader" />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable2}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default Siswa;
