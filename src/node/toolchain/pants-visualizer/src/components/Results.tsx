/*
Copyright 2021 Toolchain Labs, Inc. All rights reserved.
Licensed under the Apache License, Version 2.0 (see LICENSE).
*/

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DependencyGraph from '../dependency-graph';
import HierarchicalDigraph from '../models/hierarchical-digraph';
import VisibleGraph from '../models/visible-graph';
import {
  getEdgesFromInputData,
  initialAddressFormat,
} from '../data-structure-utils';
import FileSystem from './file-system/file-system';
import TargetDescription from './target-description/target-description';
import { hierarchicalDigraphSet } from '../store/hierarchicalDigraphSlice';
import { globalTypesMapSet } from '../store/globalTypesSlice';
import { visibleGraphSet } from '../store/visibleGraphSlice';
import { InputDataType } from '../api-calls/results-data';
import { LeafNode } from '../models/Node';
import Background from './background/background';
import Footer from './footer/footer';

const GraphContainer = styled(Grid)(() => ({
  height: '100%',
  borderRadius: 8,
  overflow: 'hidden',
}));

const InfoContainer = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));

const FileSystemContainer = styled(Grid)(() => ({
  height: '66%',
}));

const DescriptionContainer = styled(Grid)(() => ({
  height: '34%',
}));

const HideOnMobileGridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const HideOnDesktopGridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const GridTopElement = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1),
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(20),
    flex: 1,
  },
}));

const MobileMessageContainer = styled(HideOnDesktopGridItem)(() => ({
  margin: '0 auto',
}));

const NotSupportedOnMobileText = styled(Typography)(({ theme }) => ({
  fontFamily: 'Fira Sans',
  fontSize: 18,
  fontWeight: 400,
  lineHeight: '27px',
  letterSpacing: 0,
  textAlign: 'center',
  width: 400,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '0 16px',
  },
}));

const CommandBlock = ({
  command,
  label,
}: {
  command: string;
  label: string;
}) => (
  <Box mb={1}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'grey.100',
        borderRadius: 1,
        px: 1.5,
        py: 0.5,
        fontFamily: 'monospace',
        fontSize: 13,
      }}
    >
      <Box sx={{ flex: 1 }}>{command}</Box>
      <IconButton
        size="small"
        onClick={() => navigator.clipboard.writeText(command)}
        sx={{ ml: 1 }}
      >
        <ContentCopyIcon fontSize="small" />
      </IconButton>
    </Box>
  </Box>
);

function Results() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const resizeEvent = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', resizeEvent);

    return () => window.removeEventListener('resize', resizeEvent);
  });

  const usefulHeight = 0.82;

  const gridHeight = windowHeight * usefulHeight;
  const canvasWidth = windowWidth - 128 - 400;
  const fileSystemWidth = Math.max(windowWidth / 4, 400);

  const isMobile = windowWidth < 900;

  const ResultsContainer = styled(Grid)(() => ({
    position: 'relative',
    margin: '0 64px',
    width: 'calc(100% - 128px)',
    height: gridHeight,
  }));

  const loadTargetList = (targetList: InputDataType) => {
    const edges = getEdgesFromInputData(targetList);
    const hd = new HierarchicalDigraph(
      targetList.map(
        el => new LeafNode(initialAddressFormat(el.address), el.target_type)
      ),
      edges
    );
    const vg = VisibleGraph.initial(hd);
    dispatch(hierarchicalDigraphSet(hd));
    dispatch(visibleGraphSet(vg));
    dispatch(globalTypesMapSet(hd.leafTypeCounts()));
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target?.result as string) as InputDataType;
        loadTargetList(data);
        setFileName(file.name);
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!fileName) {
    return (
      <Background>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          flexDirection="column"
        >
          <Grid item>
            <Typography variant="h2" color="text" textAlign="center" mb={4}>
              Graph My Repo
            </Typography>
          </Grid>
          <Grid item>
            <Paper
              sx={{
                border: theme =>
                  `2px dashed ${
                    isDragging
                      ? theme.palette.primary.main
                      : theme.palette.grey[400]
                  }`,
                borderRadius: 2,
                padding: 6,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: theme =>
                  isDragging
                    ? theme.palette.action.hover
                    : theme.palette.background.paper,
                transition: 'all 0.2s ease',
                maxWidth: 500,
              }}
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Typography variant="h3" color="text.secondary" mb={2}>
                Drop a{' '}
                <span
                  style={{
                    textDecoration: 'underline dotted',
                    cursor: 'help',
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setPopoverAnchor(e.currentTarget);
                  }}
                >
                  dependency JSON file
                </span>{' '}
                here
              </Typography>
              <Popover
                open={Boolean(popoverAnchor)}
                anchorEl={popoverAnchor}
                onClose={() => setPopoverAnchor(null)}
                onClick={e => e.stopPropagation()}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                slotProps={{
                  paper: {
                    sx: {
                      p: 2.5,
                      maxWidth: 420,
                      borderRadius: 2,
                    },
                  },
                }}
              >
                <Typography variant="body2" mb={1.5}>
                  You can create such a file by running:
                </Typography>
                <CommandBlock command="pants peek ::" label="Entire repo" />
                <CommandBlock
                  command="pants peek path/to/dir::"
                  label="Subdirectory"
                />
                <Typography variant="body2" mt={1.5}>
                  See{' '}
                  <Link
                    href="https://www.pantsbuild.org/stable/reference/goals/peek"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    the Pants docs
                  </Link>{' '}
                  for details.
                </Typography>
              </Popover>
              <Typography
                variant="body1"
                color="text.secondary"
                mb={3}
                textAlign="center"
              >
                or
              </Typography>
              <Button variant="outlined" color="primary">
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                hidden
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </Paper>
          </Grid>
          <Grid item mt={5}>
            <Footer />
          </Grid>
        </Grid>
      </Background>
    );
  }

  return (
    <Background>
      <GridTopElement container spacing={2} sx={{ zIndex: 5 }}>
        <HideOnMobileGridItem
          item
          xs={12}
          alignSelf="center"
          textAlign="center"
        >
          <Typography variant="h2" color="text">
            {fileName}
          </Typography>
        </HideOnMobileGridItem>
        <HideOnMobileGridItem item xs={12}>
          <ResultsContainer container spacing={3}>
            <GraphContainer item xs>
              <DependencyGraph
                canvasWidth={canvasWidth}
                canvasHeight={gridHeight}
              />
            </GraphContainer>
            <InfoContainer item width={fileSystemWidth}>
              <Grid
                container
                flexDirection="column"
                spacing={3}
                height={gridHeight}
              >
                <FileSystemContainer item>
                  <FileSystem />
                </FileSystemContainer>
                <DescriptionContainer item>
                  <TargetDescription />
                </DescriptionContainer>
              </Grid>
            </InfoContainer>
          </ResultsContainer>
        </HideOnMobileGridItem>
        <MobileMessageContainer item>
          <Grid
            container
            flexDirection="column"
            alignItems="center"
            spacing={3}
          >
            <Grid item>
              <Typography variant="h2" color="text">
                {fileName}
              </Typography>
            </Grid>
            <Grid item>
              <NotSupportedOnMobileText textAlign="center">
                Thanks for trying out GraphMyRepo.com! The site currently only
                works on screens with resolution of at least 900x600. Please
                visit us again from a desktop browser!
              </NotSupportedOnMobileText>
            </Grid>
          </Grid>
        </MobileMessageContainer>
        <Grid item xs={12}>
          <Footer showPantsInfo={isMobile} />
        </Grid>
      </GridTopElement>
    </Background>
  );
}

export default Results;
