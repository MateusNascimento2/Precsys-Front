import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import LoginLogsList from '../components/LoginLogsList';
import FilterButton from '../components/FilterButton';
import LoginLogsFilter from '../components/LoginLogsFilter';

export default function LoginLogs() {
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    users: {},
    dates: {
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async (url, setState) => {
      try {
        setIsLoading(true);
        const { data } = await axiosPrivate.get(url, { signal: controller.signal });
        console.log(data);
        if (isMounted) setState(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData('/loginLogs', setLogs);
    fetchData('/users', setUsers);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const usersName = users.reduce((acc, user) => {
      acc[user.nome] = false;
      return acc;
    }, {});

    setFilters((prevFilters) => ({
      ...prevFilters,
      users: usersName,
    }));
  }, [users]);

  const handleInputChange = (query) => {
    setSearchQuery(query);
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      users: users.reduce((acc, user) => {
        acc[user.nome] = false;
        return acc;
      }, {}),
      dates: {
        startDate: '',
        endDate: '',
      },
    });
  };

  const handleShow = () => {
    setShow((prevState) => !prevState);

    if (document.body.style.overflow !== 'hidden') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative">
        <h2 className="font-[700] ml-5 text-[32px] md:mt-[16px] dark:text-white" id="Logs">Logs</h2>
        <div className="mt-[24px] px-5 dark:bg-neutral-900">
          <div className="flex gap-3 items-center mb-4 w-full">
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
            <FilterButton onSetShow={handleShow} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>
            <div className="hidden lg:block lg:sticky lg:top-[5%]">
              <LoginLogsFilter show={true} onSetShow={handleShow} filters={filters} onSelectedCheckboxesChange={updateFilters} resetFilters={resetFilters} users={users} />
            </div>

            <div className="w-full h-full max-h-full">
              <LoginLogsList searchQuery={searchQuery} logs={logs} users={users} isLoading={isLoading} filters={filters} />
            </div>
          </div>
        </div>
        <LoginLogsFilter show={show} onSetShow={handleShow} filters={filters} onSelectedCheckboxesChange={updateFilters} resetFilters={resetFilters} users={users} />
      </main>
    </>
  );
}