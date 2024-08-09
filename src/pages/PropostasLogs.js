import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import SearchInput from '../components/SearchInput';
import PropostasLogsList from '../components/PropostasLogsList';
import PropostasLogsFilter from '../components/PropostasLogsFilter';
import { motion } from 'framer-motion';
import ScrollToTopButton from '../components/ScrollToTopButton';

export default function LoginLogs() {
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [propostas, setPropostas] = useState([]);
  const [users, setUsers] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    users: {},
    empresas: {},
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

    fetchData('/propostasLogs', setPropostas);
    fetchData('/users', setUsers);
    fetchData('/empresas', setEmpresas);

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

    const empresasName = empresas.reduce((acc, empresa) => {
      acc[empresa.nome] = false;
      return acc;
    }, {});

    setFilters((prevFilters) => ({
      ...prevFilters,
      users: usersName,
      empresas: empresasName
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
      empresas: empresas.reduce((acc, empresa) => {
        acc[empresa.nome] = false;
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
      <motion.main className="container mx-auto pt-[120px] dark:bg-neutral-900 h-full relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 className="font-[700] ml-5 text-[32px] md:mt-[16px] dark:text-white" id="Logs" initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>Logs</motion.h2>
        <div className="mt-[24px] px-5 dark:bg-neutral-900">
          <div className="flex gap-3 items-center mb-4 w-full">
            <SearchInput searchQuery={searchQuery} onSearchQueryChange={handleInputChange} p={'py-3'} />
          </div>

          <div className={`lg:flex lg:gap-4 lg:items-start`}>


            <div className="w-full h-full max-h-full">
              <PropostasLogsList searchQuery={searchQuery} logs={propostas} users={users} empresas={empresas} isLoading={isLoading} filters={filters} />
            </div>
          </div>
        </div>
        <ScrollToTopButton />
        

      </motion.main>
    </>
  );
}