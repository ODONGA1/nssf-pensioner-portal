import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from "@mui/material";
import {
  Description,
  Download,
  Visibility,
  Share,
  Print,
  CloudDownload,
  FilePresent,
  PictureAsPdf,
  TableChart,
  Assignment,
  Verified,
  Schedule,
  MoreVert,
  Add,
  Upload,
  Security,
  Receipt,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documents-tabpanel-${index}`}
      aria-labelledby={`documents-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const DocumentsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    document: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDocument(null);
  };

  const handleDownload = (document: any) => {
    // Create a blob with sample content
    const content = generateDocumentContent(document);
    const blob = new Blob([content], { type: getContentType(document.type) });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${document.name}.${getFileExtension(document.type)}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    handleMenuClose();
  };

  const generateDocumentContent = (document: any) => {
    const currentDate = new Date().toLocaleDateString();

    switch (document.type) {
      case "PDF":
        return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${document.name}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000217 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
309
%%EOF`;

      case "CSV":
        return `Document Name,Date Generated,Type,Status
${document.name},${currentDate},${document.category},${document.status}
"Sample pension data","2023-01-01","Payment","Completed"
"Sample contribution","2023-02-01","Contribution","Verified"`;

      case "Excel":
        // Simple tab-separated format that Excel can read
        return `Document Name\tDate Generated\tType\tStatus
${document.name}\t${currentDate}\t${document.category}\t${document.status}
Sample pension data\t2023-01-01\tPayment\tCompleted
Sample contribution\t2023-02-01\tContribution\tVerified`;

      default:
        return `NSSF PENSIONER SELF-SERVICE PORTAL
Document: ${document.name}
Generated: ${currentDate}
Category: ${document.category}
Status: ${document.status}

This is a sample document generated for demonstration purposes.
In a real implementation, this would contain actual pension data.

---
NSSF Uganda
Plot 101, Jinja Road, Kampala
Tel: +256 312 234 400`;
    }
  };

  const getContentType = (type: string) => {
    switch (type) {
      case "PDF":
        return "application/pdf";
      case "CSV":
        return "text/csv";
      case "Excel":
        return "application/vnd.ms-excel";
      default:
        return "text/plain";
    }
  };

  const getFileExtension = (type: string) => {
    switch (type) {
      case "PDF":
        return "pdf";
      case "CSV":
        return "csv";
      case "Excel":
        return "xls";
      default:
        return "txt";
    }
  };

  // Mock documents data
  const documents = {
    statements: [
      {
        id: "stmt-001",
        name: "Annual Pension Statement 2023",
        type: "PDF",
        category: "Statement",
        date: "2023-12-31",
        size: "245 KB",
        status: "Available",
        description:
          "Comprehensive annual statement showing all pension payments and benefits",
      },
      {
        id: "stmt-002",
        name: "Quarterly Benefits Summary Q4 2023",
        type: "PDF",
        category: "Statement",
        date: "2023-10-31",
        size: "189 KB",
        status: "Available",
        description: "Quarterly summary of benefits and contributions",
      },
      {
        id: "stmt-003",
        name: "Payment History 2023",
        type: "CSV",
        category: "History",
        date: "2023-12-31",
        size: "87 KB",
        status: "Available",
        description: "Complete payment history in spreadsheet format",
      },
    ],
    certificates: [
      {
        id: "cert-001",
        name: "Pension Certificate",
        type: "PDF",
        category: "Certificate",
        date: "2024-01-15",
        size: "156 KB",
        status: "Available",
        description: "Official pension certificate for legal purposes",
      },
      {
        id: "cert-002",
        name: "Tax Exemption Certificate",
        type: "PDF",
        category: "Certificate",
        date: "2024-01-01",
        size: "134 KB",
        status: "Available",
        description: "Tax exemption certificate for pension payments",
      },
      {
        id: "cert-003",
        name: "Service Years Verification",
        type: "PDF",
        category: "Certificate",
        date: "2024-06-01",
        size: "198 KB",
        status: "Available",
        description: "Official verification of years of service",
      },
    ],
    forms: [
      {
        id: "form-001",
        name: "Beneficiary Update Form",
        type: "PDF",
        category: "Form",
        date: "2024-01-01",
        size: "89 KB",
        status: "Template",
        description: "Form to update beneficiary information",
      },
      {
        id: "form-002",
        name: "Address Change Request",
        type: "PDF",
        category: "Form",
        date: "2024-01-01",
        size: "76 KB",
        status: "Template",
        description: "Form to request address change",
      },
      {
        id: "form-003",
        name: "Pension Verification Form",
        type: "PDF",
        category: "Form",
        date: "2024-01-01",
        size: "112 KB",
        status: "Template",
        description: "Annual pension verification form",
      },
    ],
    personal: [
      {
        id: "pers-001",
        name: "Personal Information Summary",
        type: "PDF",
        category: "Personal",
        date: "2024-01-15",
        size: "234 KB",
        status: "Available",
        description: "Complete personal information and contact details",
      },
      {
        id: "pers-002",
        name: "Employment History Report",
        type: "Excel",
        category: "Personal",
        date: "2024-06-01",
        size: "145 KB",
        status: "Available",
        description: "Detailed employment history and contribution records",
      },
    ],
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <PictureAsPdf color="error" />;
      case "CSV":
      case "Excel":
        return <TableChart color="success" />;
      default:
        return <Description color="primary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "success";
      case "Processing":
        return "warning";
      case "Template":
        return "info";
      default:
        return "default";
    }
  };

  const documentStats = {
    totalDocuments: Object.values(documents).flat().length,
    availableDownloads: Object.values(documents)
      .flat()
      .filter((doc) => doc.status === "Available").length,
    templates: Object.values(documents)
      .flat()
      .filter((doc) => doc.status === "Template").length,
    lastUpdated: "2024-01-15",
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight="bold"
          color="primary"
        >
          Document Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access and download your pension documents, statements, and forms
        </Typography>
      </Box>

      {/* Document Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <FilePresent />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="primary">
                    Total Documents
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {documentStats.totalDocuments}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <CloudDownload />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="success.main">
                    Available
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {documentStats.availableDownloads}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="info.main">
                    Templates
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {documentStats.templates}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h6" color="warning.main">
                    Last Updated
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {new Date(documentStats.lastUpdated).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<Download />}
                fullWidth
                onClick={() => {
                  const allStatements = documents.statements;
                  allStatements.forEach((doc) => handleDownload(doc));
                }}
              >
                Download All Statements
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                fullWidth
                onClick={() => setRequestDialogOpen(true)}
              >
                Request Document
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                fullWidth
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload Document
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<Receipt />}
                fullWidth
                onClick={() => {
                  // Generate annual summary
                  const summaryDoc = {
                    name: "Annual Summary 2023",
                    type: "PDF",
                    category: "Summary",
                  };
                  handleDownload(summaryDoc);
                }}
              >
                Generate Annual Summary
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Document Categories Tabs */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="document tabs"
          >
            <Tab label="Statements & Reports" />
            <Tab label="Certificates" />
            <Tab label="Forms & Templates" />
            <Tab label="Personal Documents" />
          </Tabs>
        </Box>

        {/* Statements & Reports Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Statements & Reports
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Official statements and reports are generated monthly. Historical
            data is available for download.
          </Alert>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Document</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Size</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.statements.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {getDocumentIcon(doc.type)}
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      {new Date(doc.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <Chip
                        label={doc.status}
                        color={getStatusColor(doc.status) as any}
                        size="small"
                        icon={
                          doc.status === "Available" ? (
                            <Verified />
                          ) : (
                            <Schedule />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, doc)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Certificates Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Certificates & Official Documents
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            These are official certificates. Handle with care and store
            securely.
          </Alert>

          <Grid container spacing={3}>
            {documents.certificates.map((doc) => (
              <Grid item xs={12} md={6} lg={4} key={doc.id}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {getDocumentIcon(doc.type)}
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {doc.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doc.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2">Date:</Typography>
                      <Typography variant="body2">
                        {new Date(doc.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2">Size:</Typography>
                      <Typography variant="body2">{doc.size}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Download />}
                        onClick={() => handleDownload(doc)}
                        fullWidth
                      >
                        Download
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, doc)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Forms & Templates Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Forms & Templates
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Download these forms, fill them out, and submit them through the
            portal or at NSSF offices.
          </Alert>

          <List>
            {documents.forms.map((doc) => (
              <ListItem key={doc.id} divider>
                <ListItemIcon>{getDocumentIcon(doc.type)}</ListItemIcon>
                <ListItemText
                  primary={doc.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {doc.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={doc.status}
                          color={getStatusColor(doc.status) as any}
                          size="small"
                        />
                        <Typography variant="caption" sx={{ ml: 2 }}>
                          Size: {doc.size}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={() => handleDownload(doc)}
                  >
                    Download
                  </Button>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, doc)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Personal Documents Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Personal Documents
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Your personal information and employment records. Keep these
            documents secure.
          </Alert>

          <Grid container spacing={3}>
            {documents.personal.map((doc) => (
              <Grid item xs={12} md={6} key={doc.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                    >
                      <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                        <Security />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {doc.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {doc.description}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography variant="caption">
                            Type: {doc.type}
                          </Typography>
                          <Typography variant="caption">
                            Size: {doc.size}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Download />}
                            onClick={() => handleDownload(doc)}
                          >
                            Download
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                          >
                            Preview
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>

      {/* Document Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleDownload(selectedDocument)}>
          <Download sx={{ mr: 1 }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Visibility sx={{ mr: 1 }} />
          Preview
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Share sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Print sx={{ mr: 1 }} />
          Print
        </MenuItem>
      </Menu>

      {/* Request Document Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Document</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Document Type</InputLabel>
              <Select label="Document Type">
                <MenuItem value="statement">Annual Statement</MenuItem>
                <MenuItem value="certificate">Certificate</MenuItem>
                <MenuItem value="verification">Verification Letter</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Purpose"
              margin="normal"
              multiline
              rows={3}
              placeholder="Please specify the purpose of this document request..."
            />
            <TextField
              fullWidth
              label="Additional Notes"
              margin="normal"
              multiline
              rows={2}
              placeholder="Any additional information..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRequestDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Submit Request</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Upload sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Upload Supporting Documents
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Upload documents in PDF, JPG, or PNG format (max 5MB)
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<Upload />}
            >
              Choose Files
              <input
                type="file"
                hidden
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;
